'use strict';

const test = require('ava');
const plugin = require('../src');
const posthtml = require('posthtml');
const clean = html => html.replace(/(\n|\t)/g, '').trim();

test('Must merge and map attributes not locals to first node', async t => {
  const actual = `<component src="components/component-mapped-attributes.html" data-something="Test an attribute" title="My Title" class="bg-light p-2" style="display: flex; font-size: 20px"></component>`;
  const expected = `<div class="text-dark m-3 bg-light p-2" data-something="Test an attribute" style="display: flex; font-size: 20px">My Title Default body</div>`;

  const html = await posthtml([plugin({root: './test/templates', tag: 'component'})]).process(actual).then(result => clean(result.html));

  t.is(html, expected);
});

test('Must merge and map attributes not locals to node with attribute "attributes" without style', async t => {
  const actual = `<component src="components/component-mapped-attributes2.html" title="My Title" class="bg-light p-2" style="display: flex; font-size: 20px"></component>`;
  const expected = `<div class="mapped"><div class="text-dark m-3 bg-light p-2" style="display: flex; font-size: 20px">My Title Default body</div></div>`;

  const html = await posthtml([plugin({root: './test/templates', tag: 'component'})]).process(actual).then(result => clean(result.html));

  t.is(html, expected);
});

test('Must merge and map attributes not locals to node with attribute "attributes" without class', async t => {
  const actual = `<component src="components/component-mapped-attributes3.html" title="My Title" class="bg-light p-2" style="display: block; font-size: 20px"></component>`;
  const expected = `<div class="mapped"><div style="border: 1px solid black; display: block; font-size: 20px" class="bg-light p-2">My Title Default body</div></div>`;

  const html = await posthtml([plugin({root: './test/templates', tag: 'component'})]).process(actual).then(result => clean(result.html));

  t.is(html, expected);
});

test('Must not map attributes for component without any elements', async t => {
  const actual = `<div><component src="components/component-without-elements.html" title="My Title" class="bg-light p-2" style="display: flex; font-size: 20px"></component></div>`;
  const expected = `<div>I am a component without any elements. Yeah, something uncommon but just for testing. My Title</div>`;

  const html = await posthtml([plugin({root: './test/templates', tag: 'component'})]).process(actual).then(result => clean(result.html));

  t.is(html, expected);
});