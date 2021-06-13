# TypeScriptの型定義について
## 概要
このドキュメントの目的は、読者がTypeScriptの型宣言、型定義を読めるようになることです。

## 型定義について
TypeScriptでは、変数名の右側に型を書くことができます。
```typescript
const userName:string = "John Davis";
```
型定義と異なる値を代入しようとするとエラーになります。
```typescript
const userName:string = 123; // エラー
```
また、nullやundefinedを代入することはできません。  
(nullを代入できるようにする方法は後述)
```typescript
const userName:string = null; // エラー
const age:number = undefined; // エラー
```


それでは、TypeScriptではどのような型を指定できるのかを見ていきます。
## プリミティブ型
### string型
```typescript
const userName:string = "John Davis";
```
### number型
```typescript
const age:number = 25;
```
TypeScriptでは整数型と浮動小数点型の区別がありません(JavaScriptの仕様)。
```typescript
const pi:number = 3.1415926;
```

### boolean型
```typescript
const isOpen:boolean = true;
```
### null型
nullを指定した型には、nullしか代入することができません。
```typescript
const nullValue:null = null;
```

### undefined型
nullと同様です
```typescript
const undefinedValue:undefined = undefined;
```

## オブジェクト型
### 配列型
配列型を指定するには、型名の後ろに`[]`を付与します。
```typescript
const names: string[] = ["Alice", "Bob", "Charlie"];

const numbers: number[] = [1, 2, 3];
```
指定した型以外の値を配列に含めようとするとエラーになります。
```typescript
const names: string[] = ["Alice", "Bob", 3]; // エラー

const numbers: number[] = [1, 2, 3];
numbers.push("Charlie"); //エラー
```

### オブジェクト型
オブジェクトについても型を指定することができます。
```typescript
const user: {name: string, age:number} = {
    name: "John Davis",
    age: 25
};
```
プロパティに過不足がある場合や、プロパティの値の型が異なる場合はエラーになります。
```typescript
const user: {name: string, age:number} = {
    name: "John Davis",
}; // ageがないのでエラー

const user: {name: string, age:number} = {
    name: "John Davis",
    age: 25,
    isDeleted: false
}; // isDeletedという余計なプロパティがあるのでエラー

const user: {name: string, age:number} = {
    name: "John Davis",
    age: "25",
}; // ageがstringになっているのでエラー
```
プロパティ名末尾に`?`をつけることで、「存在してもしなくても良いプロパティ」を定義することができます。
```typescript
const user: {name: string, age:number, isDeleted?: boolean} = {
    name: "John Davis",
    age: 25,
    isDeleted: false
}; 

const user2: {name: string, age:number, isDeleted?: boolean} = {
    name: "John Davis",
    age: 25,
};  //isDeletedはなくても良い

```

## 発展的な型
### type
ところで、先程のオブジェクト型ですが、毎度毎度
`{name: string, age:number}`などと書いていたのでは冗長です。 そこで、TypeScriptではユーザーが定義した型に名前をつける機能があります。 
```typescript
type User = {name: string, age: number};
```
これで、今後の型宣言では、`{name: string, age:number}`と書く代わりに、単に`User`と書くだけでよくなりました。

型のエイリアスを定義したと考えても良いでしょう。

```typescript
const user: User = {
    name: "John Davis",
    age: 25
};
```
オブジェクトがネストしたような複雑な型でも、`type`機能を使うとスッキリ書くことができます。
```typescript
type User = {
    name: string,
    age: number,
    address: {
        zip: string,
        pref: string,
        city: string,
        address: string
    }
}
// ↓
type User = {
    name: string,
    age: number,
    address: Address
}
type Address = {
    zip: string,
    pref: string,
    city: string,
    address: string
};

```
`type`はオブジェクト型に関わらず、どのような型にでも名前をつけることができます。
```typescript
type NumberArray = number[];
type UserId = string;
```

## union型
ところで、「stringもしくはnumberの配列」は定義できるのでしょうか？ このようにすれば可能です。
```typescript
const numberOrStringArray:(string | number)[] = [1, "2", 3, "4"];
```
型名A`|`型名B で「型名Aもしくは型名B」を表す型を定義することができます。
通常の変数にも使うことができます。
```typescript
const numberOrString: string | number = 1;
const numberOrString2: string | number = "2";
```
typeと組み合わせることもできます。
```typescript
type NumberOrString = string | number;
const numberOrStringArray: NumberOrString[]  = [1, "2", 3, "4"];
```
union型を使えば、nullが代入される可能性のある型を定義することができます。
```typescript
type StringOrNull = string | null
const a:StringOrNull = "John Davis";
const b:StringOrNull = null;
```
## リテラル型
以下の変数にはどんな値を代入することができるでしょうか？
```typescript
let a:"foo";
```
答えは以下のとおりです。
```typescript
a = "foo"; // OK
a = "bar"; // NG
a = ""; // NG
```
"foo"という型は、まさに"foo"という値しか取ることができません。  
これだけだと使い道がなさそうですが、先程のunion型やtypeと組み合わせるとどうでしょうか。
```typescript
type Direction = "North" | "West" | "East" | "West";
const direction1:Direction
 = "North";
const direction2:Direction
 = "South";
const direction3:Direction
 = "NorthEast"; // エラー
```
このように、特定の値しか取らない区分値に有用です。