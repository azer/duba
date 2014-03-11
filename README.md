## duba

Duba makes it easier to manage remote and local workspaces using SSH. It takes care of pulling and pushing changes, [running remote commands](http://github.com/azer/remotely).

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
