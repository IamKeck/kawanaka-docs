# JavaScriptにおけるImmutableについて
突然ですが、以下のコードではコンソールに何という値が出力されるでしょうか？  
実際に試したりせず、頭の中で考えてお答えください。
```javascript
const a = {id: "123", name: "Miles Thompson"};
const b = a;
b.name = "John Davis";
console.log(a.name);
```

今度はこんな場合はどうでしょうか？
```javascript
const a = {id: "123", name: "Miles Thompson"};
const b = a;
b.name = "John Davis";
console.log(a === b ? "same" : "not same");
```
答えはそれぞれ、"John Davis"、"same"です。 間違えた方、わからなかった方、即答できなかった方、この記事を読んだほうが良いかもしれません。

## JavaScriptにおける変数とは
おおよそどのプログラミング言語においても使うことができる「変数」ですが、以下のようなイメージを持っていませんか？

```javascript
const a = 1;
```
<img src="/img/js_immutable/typical_variable.svg" type="image/svg+xml" height="200px">

少なくともJavaScriptにおいては、このよくある「箱」のイメージ、捨ててください。 今日から以下のようなイメージに切り替えましょう。  
(ちなみにJavaやPHP、Python、Rubyでも同じです。)

<img src="/img/js_immutable/js_variable.svg" type="image/svg+xml" width="300px">

変数aは、どこかに作られた1という値を**参照**していると考えてください。

では、このように同じ変数に再代入した場合、どうなるでしょうか?
```javascript
let a = 1;
a = 2;
```
<img src="/img/js_immutable/js_reassigned.svg" type="image/svg+xml" width="300px">


こうなります。

ちなみに元の1という値はどこからも参照されなくなったので、捨てられます。

では、aに対してこのような演算を行った場合どうでしょううか
```javascript
let a = 1;
a = a + 1;
```
この場合も、再代入を行った時同様、どこかに作られた2という値に参照先が変わります。

文字列演算の場合も同様です
```javascript
let a = "mutable";
a = "im" + a;
```

<img src="/img/js_immutable/js_calc_string.svg" type="image/svg+xml" width="600px">

いずれの場合も、**値そのものが書き換えられることはなく、計算結果による新たな値が生成されて、それが変数の参照先になる**ことに注目してください。

## Mutableな値について
ではこの場合はどうでしょうか？
```javascript
const a = {id: "123", name: "Miles Thompson"};
```
<img src="/img/js_immutable/object.svg" type="image/svg+xml" width="600px">

こうなっています。 どこかにオブジェクトが生成され、aはそれを参照しています。
そして、idやnameはまたそれぞれどこかに生成されたそれぞれの値を参照しているという具合です。

ではこうした場合はどうでしょう？
```javascript
const a = {id: "123", name: "Miles Thompson"};
a.name = "Michal Pettiford";
```

<img src="/img/js_immutable/object_reassigned.svg" type="image/svg+xml" width="600px">

こうなります。 ・・・おや？ これまでとは少々具合が異なるとは思いませんか？

数値やstringなどを扱っていたときは、必ず演算のたびに新しい値が生成されていました。
しかし、ここではaが参照している値(オブジェクト)そのものが書き換わっており、aの参照先は変わっていません。
実はJavaScriptにおいては、**値そのものを書き換えられるようなデータ型と、書き換えられないデータ型**が存在します。
具体的には以下のとおりです。

書き換えることができないデータ型
* boolean
* number
* string  
* null
* undefined
* bigint
* symbol

書き換えることができるデータ型
* object(配列などもすべてobjectであることに注意)

先程の変数aはオブジェクトを参照していました。 nameの参照先を書き換えることができたのはこれが理由です。  
しかし、nameの参照先である文字列"Miles Thompson"はstringなので書き換えることはできません。 
新たに作られた"Michael Pettiford"という文字列に参照先が切り替わりました。

## 複雑なオブジェクト
## 同値判定
## Shallow Copy(浅いコピー)
