# YAME

Yet another markdown editor.

## Features

* Markdown lint
* WYSIWYG Preview (Thanks [HyperMD](https://laobubu.net/HyperMD/#README.md)) OR Source / Preview side by side
* Web Component

## Run a demo

```shell
yarn dev
```

## Build

```shell
yarn build
```

## TODO

### lint

* [x] 不规范 markdown 语法警告

### 快捷键

* [ ] `ctrl+l` 选中文字插入链接
* [x] `ctrl+i` 选中文字斜体
* [x] `ctrl+b` 加粗
* [ ] `ctrl+q` 引用

### snippets + `tab`

* [ ] `[` 链接
* [ ] `![` 图片
* [ ] `[b` 加粗
* [ ] `[i` 斜体
* [ ] `[bi`/`[ib` 斜体加粗
* [ ] `[cb{lang}` 代码块，lang 是可选的，表示语言
* [ ] `[x` 任务列表（已完成）
* [ ] `[[` 任务列表（未完成）
