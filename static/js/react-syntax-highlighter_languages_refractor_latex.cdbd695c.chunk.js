(this["webpackJsonpeosio-signing-request-multipass"]=this["webpackJsonpeosio-signing-request-multipass"]||[]).push([[71],{671:function(a,e,t){"use strict";function n(a){!function(a){var e=/\\(?:[^a-z()[\]]|[a-z*]+)/i,t={"equation-command":{pattern:e,alias:"regex"}};a.languages.latex={comment:/%.*/m,cdata:{pattern:/(\\begin\{((?:verbatim|lstlisting)\*?)\})[\s\S]*?(?=\\end\{\2\})/,lookbehind:!0},equation:[{pattern:/\$\$(?:\\[\s\S]|[^\\$])+\$\$|\$(?:\\[\s\S]|[^\\$])+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/,inside:t,alias:"string"},{pattern:/(\\begin\{((?:equation|math|eqnarray|align|multline|gather)\*?)\})[\s\S]*?(?=\\end\{\2\})/,lookbehind:!0,inside:t,alias:"string"}],keyword:{pattern:/(\\(?:begin|end|ref|cite|label|usepackage|documentclass)(?:\[[^\]]+\])?\{)[^}]+(?=\})/,lookbehind:!0},url:{pattern:/(\\url\{)[^}]+(?=\})/,lookbehind:!0},headline:{pattern:/(\\(?:part|chapter|section|subsection|frametitle|subsubsection|paragraph|subparagraph|subsubparagraph|subsubsubparagraph)\*?(?:\[[^\]]+\])?\{)[^}]+(?=\}(?:\[[^\]]+\])?)/,lookbehind:!0,alias:"class-name"},function:{pattern:e,alias:"selector"},punctuation:/[[\]{}&]/},a.languages.tex=a.languages.latex,a.languages.context=a.languages.latex}(a)}a.exports=n,n.displayName="latex",n.aliases=["tex","context"]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_latex.cdbd695c.chunk.js.map