# Markdown

## GitLab Flavored Markdown (GFM)

> **Note:**
> Not all of the GitLab-specific extensions to Markdown that are described in
> this document currently work on our documentation website.
>
> For the best result, we encourage you to check this document out as rendered
by GitLab: [markdown.md]

_GitLab uses (as of 11.1) the [CommonMark Ruby Library][commonmarker] for Markdown processing of all new issues, merge requests, comments, and other Markdown content in the GitLab system.  Previous content and Markdown files `.md` in the repositories are still processed using the [Redcarpet Ruby library][redcarpet]._

_Where there are significant differences, we will try to call them out in this document._

GitLab uses "GitLab Flavored Markdown" (GFM). It extends the standard Markdown in a few significant ways to add some useful functionality. It was inspired by [GitHub Flavored Markdown](https://help.github.com/articles/basic-writing-and-formatting-syntax/).

You can use GFM in the following areas:

- comments
- issues
- merge requests
- milestones
- snippets (the snippet must be named with a `.md` extension)
- wiki pages
- markdown documents inside the repository (currently only rendered by Redcarpet)

You can also use other rich text files in GitLab. You might have to install a
dependency to do so. Please see the [github-markup gem readme](https://github.com/gitlabhq/markup#markups) for more information.

### Newlines

GFM honors the markdown specification in how [paragraphs and line breaks are handled](https://daringfireball.net/projects/markdown/syntax#p).

A paragraph is simply one or more consecutive lines of text, separated by one or more blank lines.
Line-breaks, or soft returns, are rendered if you end a line with two or more spaces:

[//]: # (Do *NOT* remove the two ending whitespaces in the following line.)
[//]: # (They are needed for the Markdown text to render correctly.)
    Roses are red [followed by two or more spaces]  
    Violets are blue

    Sugar is sweet

[//]: # (Do *NOT* remove the two ending whitespaces in the following line.)
[//]: # (They are needed for the Markdown text to render correctly.)
Roses are red  
Violets are blue

Sugar is sweet

### Multiple underscores in words

It is not reasonable to italicize just _part_ of a word, especially when you're dealing with code and names that often appear with multiple underscores. Therefore, GFM ignores multiple underscores in words:

    perform_complicated_task

    do_this_and_do_that_and_another_thing

perform_complicated_task

do_this_and_do_that_and_another_thing

### URL auto-linking

GFM will autolink almost any URL you copy and paste into your text:

    * https://www.google.com
    * https://google.com/
    * ftp://ftp.us.debian.org/debian/
    * smb://foo/bar/baz
    * irc://irc.freenode.net/gitlab
    * http://localhost:3000

- https://www.google.com
* https://google.com/
* ftp://ftp.us.debian.org/debian/
* smb://foo/bar/baz
* irc://irc.freenode.net/gitlab
* http://localhost:3000

### Multiline Blockquote

> If this is not rendered correctly, see
https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/markdown.md#multiline-blockquote

On top of standard Markdown [blockquotes](#blockquotes), which require prepending `>` to quoted lines,
GFM supports multiline blockquotes fenced by <code>>>></code>:

```no-highlight
>>>
If you paste a message from somewhere else

that

spans

multiple lines,

you can quote that without having to manually prepend `>` to every line!
>>>
```

>>>
If you paste a message from somewhere else

that

spans

multiple lines,

you can quote that without having to manually prepend `>` to every line!
>>>

### Code and Syntax Highlighting

> If this is not rendered correctly, see
https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/markdown.md#code-and-syntax-highlighting

_GitLab uses the [Rouge Ruby library][rouge] for syntax highlighting. For a
list of supported languages visit the Rouge website._

Blocks of code are either fenced by lines with three back-ticks <code>```</code>,
or are indented with four spaces. Only the fenced code blocks support syntax
highlighting:

```no-highlight
Inline `code` has `back-ticks around` it.
```

Inline `code` has `back-ticks around` it.

Example:

    ```javascript
    var s = "JavaScript syntax highlighting";
    alert(s);
    ```

    ```python
    def function():
        #indenting works just fine in the fenced code block
        s = "Python syntax highlighting"
        print s
    ```

    ```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

    ```
    No language indicated, so no syntax highlighting.
    s = "There is no highlighting for this."
    But let's throw in a <b>tag</b>.
    ```

becomes:

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

```python
def function():
    #indenting works just fine in the fenced code block
    s = "Python syntax highlighting"
    print s
```

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

```no
No language indicated, so no syntax highlighting.
s = "There is no highlighting for this."
But let's throw in a <b>tag</b>.
```

### Task Lists

> If this is not rendered correctly, see
https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/markdown.md#task-lists

You can add task lists to issues, merge requests and comments. To create a task list, add a specially-formatted Markdown list, like so:

```no-highlight
- [x] Completed task
- [ ] Incomplete task
  - [ ] Sub-task 1
  - [x] Sub-task 2
  - [ ] Sub-task 3
```

- [x] Completed task
- [ ] Incomplete task
  - [ ] Sub-task 1
  - [x] Sub-task 2
  - [ ] Sub-task 3

Tasks formatted as ordered lists are supported as well:

```no-highlight
1. [x] Completed task
1. [ ] Incomplete task
    1. [ ] Sub-task 1
    1. [x] Sub-task 2
```

1. [x] Completed task
1. [ ] Incomplete task
    1. [ ] Sub-task 1
    1. [x] Sub-task 2

Task lists can only be created in descriptions, not in titles. Task item state can be managed by editing the description's Markdown or by toggling the rendered check boxes.

### Math

> If this is not rendered correctly, see
https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/markdown.md#math

It is possible to have math written with the LaTeX syntax rendered using [KaTeX][katex].

Math written inside ```$``$``` will be rendered inline with the text.

Math written inside triple back quotes, with the language declared as `math`, will be rendered on a separate line.

Example:

    This math is inline $`a^2+b^2=c^2`$.

    This is on a separate line
    ```math
    a^2+b^2=c^2
    ```

Becomes:

This math is inline $a^2+b^2=c^2$.

This is on a separate line

```math
a^2+b^2=c^2
```

_Be advised that KaTeX only supports a [subset][katex-subset] of LaTeX._

>**Note:**
This also works for the asciidoctor `:stem: latexmath`. For details see the [asciidoctor user manual][asciidoctor-manual].

## Standard Markdown

### Headers

```no-highlight
# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------
```

### Header IDs and links

All Markdown-rendered headers automatically get IDs, except in comments.

On hover, a link to those IDs becomes visible to make it easier to copy the link to the header to give it to someone else.

The IDs are generated from the content of the header according to the following rules:

1. All text is converted to lowercase.
1. All non-word text (e.g., punctuation, HTML) is removed.
1. All spaces are converted to hyphens.
1. Two or more hyphens in a row are converted to one.
1. If a header with the same ID has already been generated, a unique
   incrementing number is appended, starting at 1.

For example:

```no
# This header has spaces in it
## This header has a :thumbsup: in it
# This header has Unicode in it: 한글
## This header has spaces in it
### This header has spaces in it
## This header has 3.5 in it (and parentheses)
```

Would generate the following link IDs:

1. `this-header-has-spaces-in-it`
1. `this-header-has-a-in-it`
1. `this-header-has-unicode-in-it-한글`
1. `this-header-has-spaces-in-it`
1. `this-header-has-spaces-in-it-1`
1. `this-header-has-3-5-in-it-and-parentheses`

Note that the Emoji processing happens before the header IDs are generated, so the Emoji is converted to an image which then gets removed from the ID.

### Emphasis

Examples:

```no-highlight
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
```

Become:

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

### Lists

Examples:

```no-highlight
1. First ordered list item
2. Another item
   * Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
   1. Ordered sub-list
4. And another item.

* Unordered list can use asterisks
- Or minuses
+ Or pluses
```

Become:

1. First ordered list item
2. Another item
   * Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
   1. Ordered sub-list
4. And another item.

* Unordered list can use asterisks
- Or minuses
+ Or pluses

If a list item contains multiple paragraphs,
each subsequent paragraph should be indented to the same level as the start of the list item text (_Redcarpet: paragraph should be indented with four spaces._)

Example:

```no-highlight
1. First ordered list item

   Second paragraph of first item.

2. Another item
```

Becomes:

1. First ordered list item

    Paragraph of first item.

1. Another item

If the paragraph of the first item is not indented with the proper number of spaces,
the paragraph will appear outside the list, instead of properly indented under the list item.

Example:

```no-highlight
1. First ordered list item

  Paragraph of first item.

2. Another item
```

Becomes:

1. First ordered list item

  Paragraph of first item.

2. Another item

### Links

There are two ways to create links, inline-style and reference-style.

    [I'm an inline-style link](https://www.google.com)

    [I'm a reference-style link][Arbitrary case-insensitive reference text]

    [I'm a relative reference to a repository file](LICENSE)

    [I am an absolute reference within the repository](/doc/user/markdown.md)

    [I link to the Milestones page](/../milestones)

    [You can use numbers for reference-style link definitions][1]

    Or leave it empty and use the [link text itself][]

    Some text to show that the reference links can follow later.

    [arbitrary case-insensitive reference text]: https://www.mozilla.org
    [1]: http://slashdot.org
    [link text itself]: https://www.reddit.com

>**Note:**
Relative links do not allow referencing project files in a wiki page or wiki
page in a project file. The reason for this is that, in GitLab, wiki is always
a separate Git repository. For example, `[I'm a reference-style link](style)`
will point the link to `wikis/style` when the link is inside of a wiki markdown file.

### Images

Examples:

    Here's our logo (hover to see the title text):

    Inline-style:
    ![alt text](img/markdown_logo.png)

    Reference-style:
    ![alt text1][logo]

    [logo]: img/markdown_logo.png

Become:

Here's our logo:

Inline-style:

![alt text](img/markdown_logo.png)

Reference-style:

![alt text][logo]

[logo]: img/markdown_logo.png

### Blockquotes

Examples:

```no-highlight
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.
```

Become:

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.

### Inline HTML

You can also use raw HTML in your Markdown, and it'll mostly work pretty well.

See the documentation for HTML::Pipeline's [SanitizationFilter](http://www.rubydoc.info/gems/html-pipeline/1.11.0/HTML/Pipeline/SanitizationFilter#WHITELIST-constant) class for the list of allowed HTML tags and attributes.  In addition to the default `SanitizationFilter` whitelist, GitLab allows `span`, `abbr`, `details` and `summary` elements.

Examples:

```no-highlight
<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>
```

Become:

<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>

#### Details and Summary

Content can be collapsed using HTML's [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) and [`<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary) tags. This is especially useful for collapsing long logs so they take up less screen space.

<p>
<details>
<summary>Click me to collapse/fold.</summary>

These details <em>will</em> remain <strong>hidden</strong> until expanded.

<pre><code>PASTE LOGS HERE</code></pre>

</details>
</p>

**Note:** Markdown inside these tags is supported, as long as you have a blank link after the `</summary>` tag and before the `</details>` tag, as shown in the example.  _Redcarpet does not support Markdown inside these tags.  You can work around this by using HTML, for example you can use `<pre><code>` tags instead of [code fences](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/markdown.md#code-and-syntax-highlighting)._

```html
<details>
<summary>Click me to collapse/fold.</summary>

These details _will_ remain **hidden** until expanded.

    PASTE LOGS HERE

</details>
```

### Horizontal Rule

Examples:

```
Three or more...

---

Hyphens

***

Asterisks

___

Underscores
```

Become:

Three or more...

---

Hyphens

***

Asterisks

___

Underscores

### Line Breaks

A good way to learn how line breaks work is to experiment and discover -- hit <kbd>Enter</kbd> once (i.e., insert one newline), then hit it twice (i.e., insert two newlines), see what happens. You'll soon learn to get what you want. The "Preview" tab is your friend.

Here are some things to try out:

Examples:

```no
Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also a separate paragraph, but...
This line is only separated by a single newline, so it *does not break* and just follows the previous line in the *same paragraph*.

This line is also a separate paragraph, and...  
This line is *on its own line*, because the previous line ends with two spaces. (but still in the *same paragraph*)

spaces.
```

Become:

Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also a separate paragraph, but...
This line is only separated by a single newline, so it *does not break* and just follows the previous line in the *same paragraph*.

This line is also a separate paragraph, and...  
This line is *on its own line*, because the previous line ends with two spaces. (but still in the *same paragraph*)

spaces.

### Tables

Tables aren't part of the core Markdown spec, but they are part of GFM.

Example:

```markdown
| header 1 | header 2 |
| -------- | -------- |
| cell 1   | cell 2   |
| cell 3   | cell 4   |
```

Becomes:

| header 1 | header 2 |
| -------- | -------- |
| cell 1   | cell 2   |
| cell 3   | cell 4   |

**Note:** The row of dashes between the table header and body must have at least three dashes in each column.

By including colons in the header row, you can align the text within that column.

Example:

```markdown
| Left Aligned | Centered | Right Aligned | Left Aligned | Centered | Right Aligned |
| :----------- | :------: | ------------: | :----------- | :------: | ------------: |
| Cell 1       | Cell 2   | Cell 3        | Cell 4       | Cell 5   | Cell 6        |
| Cell 7       | Cell 8   | Cell 9        | Cell 10      | Cell 11  | Cell 12       |
```

Becomes:

| Left Aligned | Centered | Right Aligned | Left Aligned | Centered | Right Aligned |
| :----------- | :------: | ------------: | :----------- | :------: | ------------: |
| Cell 1       | Cell 2   | Cell 3        | Cell 4       | Cell 5   | Cell 6        |
| Cell 7       | Cell 8   | Cell 9        | Cell 10      | Cell 11  | Cell 12       |

### Footnotes

Example:

```markdown
You can add footnotes to your text as follows.[^2]
[^2]: This is my awesome footnote.
```

Becomes:

You can add footnotes to your text as follows.[^2]

The formula for water is H<sub>2</sub>O while the equation for the theory of relativity is E = mc<sup>2</sup>.

## References

- This document leveraged heavily from the [Markdown-Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
- The [Markdown Syntax Guide](https://daringfireball.net/projects/markdown/syntax) at Daring Fireball is an excellent resource for a detailed explanation of standard markdown.
- [Dillinger.io](http://dillinger.io) is a handy tool for testing standard markdown.

[^1]: This link will be broken if you see this document from the Help page or docs.gitlab.com
[^2]: This is my awesome footnote.

[markdown.md]: https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/markdown.md
[mermaid]: https://mermaidjs.github.io/ "Mermaid website"
[rouge]: http://rouge.jneen.net/ "Rouge website"
[redcarpet]: https://github.com/vmg/redcarpet "Redcarpet website"
[katex]: https://github.com/Khan/KaTeX "KaTeX website"
[katex-subset]: https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX "Macros supported by KaTeX"
[asciidoctor-manual]: http://asciidoctor.org/docs/user-manual/#activating-stem-support "Asciidoctor user manual"
[commonmarker]: https://github.com/gjtorikian/commonmarker
