const {readdirSync, readFileSync, writeFileSync} = require('fs');
const path = require('path');
const posthtml = require('posthtml');
const components = require('../src');
const beautify = require('posthtml-beautify');
const anchor = require('markdown-it-anchor');
const markdownIt = require('posthtml-markdownit');
const markdownItToc = require('markdown-it-toc-done-right');
// const {render} = require('posthtml-render');
// const hljs = require('highlight.js');

const src = './examples/src/pages/';
const dist = './examples/dist/';
const md = './examples/src/md';

const plugins = [
  components({
    root: './examples/src',
    roots: ['components', 'layouts'],
    strict: true,
    expressions: {
      locals: {
        title: 'PostHTML Components'
      }
    }
  }),

  markdownIt({
    root: md,
    plugins: [
      {
        plugin: anchor,
        options: {
          level: [1, 2, 3],
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            placement: 'before'
          })
        }
      },
      {
        plugin: markdownItToc,
        options: {
          level: [1, 2, 3],
          containerClass: 'h-100 flex-column align-items-stretch ps-4 p-3 bg-white rounded-3 doc-shadow',
          containerId: 'header-toc',
          listClass: 'nav flex-column',
          itemClass: 'nav-item',
          linkClass: 'nav-link',
          listType: 'ul'
        }
      }
    ]
  }),

  beautify({
    rules: {
      indent: 2,
      blankLines: false,
      sortAttr: false
    }
  }),

  processCodeTags()
];

const options = {};

readdirSync(src).forEach(file => {
  const html = readFileSync(path.resolve(`${src}${file}`), 'utf-8');

  posthtml(plugins)
    .process(html, options)
    .then(result => {
      writeFileSync(path.resolve(`${dist}${file}`), result.html, 'utf-8');
    });
});

function processCodeTags () {
  return function(tree) {
    tree.match.call(tree, {tag: 'pre'}, function(node) {
      node.content = Array.from(node.content).map(content => {
        if (typeof content === 'string') {
          content = '';
        } else if (content.tag === 'code' && content.attrs?.class?.startsWith('language-')) {
          Array.from(content.content).forEach((c, i) => {
            content.content[i] = c.trim()
          });
        }
        return content;
      });
      return node;
    });

    // tree.match.call(tree, {tag: 'code'}, function(node) {
    //   if (Array.isArray(node.content)) {
    //     node.content = hljs.highlight(render(node.content), {language: 'html'}).value
    //   } else {
    //     node.content = hljs.highlightAuto(node.content).value
    //   }
    //   return node;
    // });
  }
}
