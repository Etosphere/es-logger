# es-logger

A simple logger for CoC.

## Introduction

The logger will render the input log into a collapsible outline. Format of the log file should be as follows:

```
---
title: "An Example Title"
color:
  kp: "#dc6a38"
  dicer: "#2c3e50"
  PC 1: "#782175"
  PC 2: "#0c1403"
  PC 3: "#4d4e4f"
kp:
  - "kp"
dicer:
  - "dicer"
show_command: false
show_comment: false
---
<{>
<kp> The above line represents the beginning of a realm (actually is the global realm).
<PC 2>write something...
<PC 3> write something
in two lines.
<kp>write something too...
<{>
<kp>Now we are in a field that only me, PC 1 and PC 2 can see the text.
<PC 1>
<PC 2> So PC 3 won't see this line.
<PC 2> The following line is comment line, starting with a round bracket.
(Here is a comment line.)
<kp> The following line is command line, starting with a dot.
<kp> .rh
<dicer>Show Command Result...
<kp> The following line represents the end of a realm.
<}>
<kp> The following line represents the end of the global realm.
<}>
```

The output collapsible outline will be like:

- <kp> The above line represents the beginning of a realm (actually is the global realm).
- <PC 2> write something...
- <PC 3> write something in two lines.
- <kp> write something too...
- {PC 2, PC 1}
  - <kp> Now we are in a field that only me, PC 1 and PC 2 can see the text.
  - <PC 2> So PC 3 won't see this line.
  - <PC 2> The following line is comment line, starting with a round bracket.
  - <kp> The following line is command line, starting with a dot.
  - <kp> The following line represents the end of a realm.
- <kp> The following line represents the end of the global realm.

## Log Syntax

### Overview

The log file is a plain text file (the extension should be`.log`, `.txt`, or `.txt`), composed of three kinds of "commands": header, realm, and role behavior.

### YAML header

The YAML header initializes some configurations (some of them can be set in the web app). The header will **only** start on the first line of the log file.

To begin a YAML header, the **first line** of the log file should be `---`, which is the same way as starting a YAML document. Then you can start writing the YAML part. Following configurations are supported:

- `title`: set the title of rendered outline
- `color`: set colors for each roles
- `kp`: set one (or more) roles as keeper (kp)
- `dicer`: set one (or more) roles as dice rolling bot
- `show_command`: set whether to display the command content in the outline by default
- `show_comment`: set whether to display the comment content in the outline by default

After finishing the YAML configuration, don't forget to add another `---` line to end the YAML header.

Here is an example:

```{yaml}
---
title: "An Example Title"
color:
  kp: "#dc6a38"
  dicer: "#2c3e50"
  PC 1: "#782175"
  PC 2: "#0c1403"
  PC 3: "#4d4e4f"
kp:
  - "kp"
dicer:
  - "dicer"
show_command: false
show_comment: false
---
```

### Realm

A realm determines the scope of the role's visibility of the text. A realm determines the scope of the character's visibility of the text.

> If role "Alice" does not appear in the realm, then the text in this realm should not be seen in Alice's perspective.
>
> If only "Alice" and "Bob" are in the realm, then the realm should be **displayed** in the joint perspective of Alice and Bob, be **collapsed** in the perspective of one of Alice and Bob, and be **hidden** in the perspective of others.

To make a realm, wrap the lines you want to set with `<{>` and `<}>`. Both `<{>` and `<}>` should be on new lines.

**Notice**: If you want to add a role in the realm, but no role behaviors, you can add an empty behavior line `<name>` in the realm.

Here is an example:

```
<{>
<kp>Now we are in a field that only me, PC 1 and PC 2 can see the text.
<PC 1>
<PC 2> So PC 3 won't see this line.
<PC 2> The following line is comment line, starting with a round bracket.
(Here is a comment line.)
<kp> The following line is command line, starting with a dot.
<kp> .rh
<dicer>Show Command Result...
<kp> The following line represents the end of a realm.
<}>
```

### Role behaviors (action / command / comment)

The role behavior is composed of role name and specific content. The syntax should be `<name> content`. The space between `<name>` and `content` is not necessary.

There are three types of role behaviors:

- `action`: starting with a character other than dot and round bracket (can take up multiple lines)
- `command`: starting with a dot (`.`, or `。` in Chinese) (can only take up one line)
- `comment`: starting with a round bracket (`(`, or `（` in Chinese) (can only take up one line)

If a line does not explicitly specify a role at the beginning of the line, the line will be considered a multiple-line action, or a single-line command/comment, depending on its first character.

Here is an example:

```
<kp> Here is a single-line action.
<PC 1> Here is a multiple-line action.
Here is the second line.
<PC 2> (Here is a comment, right bracket is not necessary.)
<PC 3> .it's a command line
<PC 4> Here is a multiple-line action, line 1.
line 2.
(Interrupt with a comment
Here is a new multiple-line action, line 1.
```

## Special Thanks

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The favicon is from illustrator [当然是金荆啦](https://space.bilibili.com/3255771/), image source is on [bilibili](https://t.bilibili.com/509792783880897356).

