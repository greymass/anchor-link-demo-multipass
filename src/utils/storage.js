import AnchorLink, { LinkSession } from 'anchor-link'

interface SessionStorage {
  clear(): Promise<void>;
  restore(
    link: AnchorLink,
    id: string,
    accountName?: string,
    permissionName?: string
  ): LinkSession | null;
  remove(
    id: string,
    accountName?: string,
    permissionName?: string
  ): Promise<void>;
  store(
    session: LinkSession,
    id: string,
    accountName?: string,
    permissionName?: string
  ): Promise<void>;
}

export default class LocalSessionStorage implements SessionStorage {
  constructor(keyPrefix: string = 'anchorlink') {
    this.keyPrefix = keyPrefix;
  }

  clear() {
    for (var i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      const [ keyPrefix ] = key.split('-');
      if (keyPrefix === this.keyPrefix) {
        localStorage.removeItem(key);
      }
    }
  }

  recentSessionKey(id: string) {
    return [this.keyPrefix, 'recent', id].join('-');
  }

  restore(link: AnchorLink, id: string, accountName?: string, permissionName?: string) {
    let data;
    // If an accountName and permissionName are provided, load the session specific to it
    if (accountName && permissionName) {
      const key = this.sessionKey(id, accountName, permissionName);
      data = localStorage.getItem(key);
    } else {
      // If no accountName or permissionName, load the most recently restored session
      const key = this.recentSessionKey(id);
      const ref = localStorage.getItem(key);
      if (ref) {
        data = localStorage.getItem(ref);
      }
    }
    // If a session was found in localStorage, parse and restore it
    if (data) {
      // Convert the stored JSON to an object
      const parsed = JSON.parse(data)
      // Retrieve the actor/permission from this session
      const { actor, permission } = parsed.data.auth;
      // Set the restored session as the most recently used
      this.setRecent(id, actor, permission);
      // Return the session
      return LinkSession.restore(link, parsed);
    }
    return null;
  }

  async remove(id: string, accountName?: string, permissionName?: string) {
    // Remove this specific key from local storage
    const sessionKey = this.sessionKey(id, accountName, permissionName);
    localStorage.removeItem(sessionKey);
    // Determine if the removed account was the last used, and if so, remove that too
    const recentKey = this.recentSessionKey(id);
    const recentSession = localStorage.getItem(recentKey);
    if (sessionKey === recentSession) {
      localStorage.removeItem(recentKey);
    }
  }

  scan() {
    const matches = [];
    for (var i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      const [ , storageType, chainId, accountName, permissionName ] = key.split('-');
      if (storageType === 'session') {
        matches.push({
          accountName,
          chainId,
          key,
          permissionName,
        })
      }
    }
    return matches;
  }

  async setRecent(id: string, accountName?: string, permissionName?: string) {
    const key = this.sessionKey(id, accountName, permissionName);
    const recentKey = this.recentSessionKey(id);
    localStorage.setItem(recentKey, key);
  }

  sessionKey(id: string, accountName?: string, permissionName?: string) {
    return [this.keyPrefix, 'session', id, accountName, permissionName]
      .filter(v => typeof v === 'string' && v.length > 0)
      .join('-');
  }

  async store(session: LinkSession, id: string, accountName?: string, permissionName?: string) {
    const key = this.sessionKey(id, accountName, permissionName);
    const data = session.serialize();
    localStorage.setItem(key, JSON.stringify(data));
    const recentKey = this.recentSessionKey(id);
    localStorage.setItem(recentKey, key);
  }

}
