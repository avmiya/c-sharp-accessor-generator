# c-sharp-accessor-generator README

This extension generate C# accessor from the class variable declarations.

# 特徴 Feature

modifier…

initial value…

line comment…

## it's Unrelated!

Add '_' to the beginning of the variable.

    private int _hoge = 100;    // temp comment

Right click menu is select to "Generate C# Accessor"… ↓

    public int hoge {
        get { retrun _hoge; }
        set { _hoge = value; }
    }

There is also "Getter Onry" & "Setter Onry"

    public int hoge { get { return _hoge; } }
    public int hoge { set { _hoge = value; } }


## Known issues

## A lot!!

I use "private time" to make "This Extension".

Don't expect too much.

## Release notes

### 0.1.0

First release!

### 0.1.1

Register GitHub.

### 0.1.2

Write this readme.

-------------------------------------------------- -------------------------------------------------- -------

**楽しい！**