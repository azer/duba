## duba

Duba lets you have a secondary, remote or local workspace. It pulls/pushes projects, runs remote commands via SSH.

![](https://i.cloudup.com/P9mTce6rHf.png)

## Install

```bash
$ npm install -g duba
```

## Commands

### pull

It'll copy (or sync) the project you specified into your local workspace and run `npm install` command
if it's a NodeJS command.

Example:

```bash
$ duba pull foobar.js
```

You can also run it from inside of a project to just sync it by overriding the local changes:

```bash
$ cd foobar.js
$ duba pull
```

### push

Sync local changes into remote directory.

Example:

```bash
$ duba pull foobar.js && cd foobar.js
$ cat > new-file
hello world
$ duba push
```

### run

Execute a command in the remote directory of the current workspace:

```bash
$ duba pull foobar.js && cd foobar.js
$ duba run head package.json
{
  "name": "foobar.js"
  "version": "0.0.0"
```
