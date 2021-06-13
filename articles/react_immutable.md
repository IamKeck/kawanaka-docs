# Reactではオブジェクトを変更してはいけない
この記事は、実際に書かれているコードをご自分で実装、ブラウザで動作を確認しながら読み進めることをおすすめします。

突然ですが、このようなコンポーネントを考えてみましょう。
```typescript jsx

import React from 'react';

type State = {
    inputName: string,
    users: string[]
};
const initialState = {
    inputName: "",
    users: []
};
function App() {
    const [state, setState] = React.useState<State>(initialState);
    return (
        <div>
            name: <input type="text" value={state.inputName}/>
            <button>submit</button>
            <ul>
                {state.users.map((userName) => (
                    <li>{userName}</li>
                ))}
            </ul>
        </div>
    );
}
```

ユーザー名を入力し、submitボタンを押下することでユーザー登録、登録済みユーザー一覧を表示するというコンポーネントです。

## ユーザー名を受け取る
イベントハンドラが全く設定されていませんので、実装していきましょう。
まずユーザー名の受け取りから・・・

```typescript jsx
function App() {
    const [state, setState] = React.useState<State>(initialState);
    const setName:React.ChangeEventHandler<HTMLInputElement> = (e) => {
        state.inputName = e.target.value;
        setState(state);
    };
    return (
        <div>
            name: <input type="text" value={state.inputName} onChange={setName}/>
            <button>submit</button>
            <ul>
                {state.users.map((userName) => (
                    <li>{userName}</li>
                ))}
            </ul>
        </div>
    );
}
```
setNameイベントハンドラを設定、state.nameにユーザーが入力した値を設定、setStateでstateをセット・・・

試しにテキストボックスに値を入力してみましょう。 

・・・どうでしょうか？ キーボードを叩いているにも関わらずテキストボックスには値が入力されないという状況になったのではないかと思います。


`setName`イベントハンドラはこのように実装する必要があります。

```typescript
    const setName:React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState({
            ...state,
            inputName: e.target.value
        });
    };
```
今度はテキストボックスにフォーカスを当ててキーボードを叩くと、テキストボックスに正しく値が反映されたのではないでしょうか？

何が違うのでしょうか？ 修正版のsetNameでは一体何をやっているのでしょうか？

Reactでは、setStateにおいて新旧stateオブジェクトが`===`演算子で比較されます。
新旧stateオブジェクトが異なると判定されると再レンダリングが行われます。
しかし同一と判定されると再レンダリングは行われません。stateが同一ならば表示結果も同じはずなので、当然わざわざ再レンダリングを行う必要はないわけです。

JavaScriptにおいては、すべての変数はポインタであるため、
古いstateのプロパティを変更、そのままsetStateでセットしてしまうと、新旧stateは同一オブジェクトとなってしまうため、`===`比較ではtrue、
つまり新旧stateは同一オブジェクトと判定されてしまいます。 同一オブジェクトである以上再レンダリングは行われないため、仮想DOMは更新されません。
inputのvalue属性も`""`のままです。 したがって、入力した値がテキストボックスに反映されていないように見えたのでした。

では、どうしてやればよいのでしょうか？   
stateオブジェクトをそっくりそのままコピーした新しいオブジェクトを作成、
その上で、inputNameには新しい値をセットしてやればよいのです。 それがこの`{...state}`構文です。
構文についての詳しい説明は [ここ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) にあります。

以下のように覚えてください。

**オブジェクトに変更を加えたい場合は、オブジェクトを直接変更するのではなく、コピーしてから新しいオブジェクトを変更する 元のオブジェクトは変更しない**


## ユーザー一覧を更新する
それでは、submitボタンを押下したときにユーザーを新規登録する処理を実装してみましょう。

```typescript jsx
function App() {
    const [state, setState] = React.useState<State>(initialState);
    const setName:React.ChangeEventHandler<HTMLInputElement> = (e) => {
        state.inputName = e.target.value;
        setState(state);
    };
    const onSubmit = () => {
        const users = state.users;
        users.push(state.inputName);
        setState({
            ...state,
            users: users
        });
    };
    return (
        <div>
            name: <input type="text" value={state.inputName} onChange={setName}/>
            <button onClick={onSubmit}>submit</button>
            <ul>
                {state.users.map((userName) => (
                    <li>{userName}</li>
                ))}
            </ul>
        </div>
    );
}
```
こうでしょうか？ onSubmitイベントハンドラを実装して、その中でstateのusers配列に新たに名前をpushして、setStateで状態更新・・・

実はこれでもうまく動くのですが、特定の場合ではうまく動かないことがあります(その特定の場合については後述)。

新旧stateは別のオブジェクトになっていますが、usersプロパティが指す配列については同じオブジェクトになってしまっています。
オブジェクト(配列もオブジェクトの一種です)に直接変更を加えるのはルール違反でした。 ではどうすればよいのでしょうか？

```typescript jsx
    const onSubmit = () => {
        const users = [...state.users];
        users.push(state.inputName);
        setState({
            ...state,
            users: users
        });
    };
```
**変更を加えるなら、コピーしてから行う**のが原則でした。そこで、スプレッド構文によりusers配列をコピー、新しく作成した配列のほうにユーザーを追加します。
stateもコピーし、usersプロパティには新しい配列をセット。

これで既存のオブジェクトに一切手を加えず、新たなstateを作成することができました。

## users配列を直接変更するとうまく動かない場合
以下のように、users一覧が別コンポーネントになっており、[メモ化](https://ja.reactjs.org/docs/react-api.html#reactmemo) されていた場合、うまくuser一覧が更新されません。

```typescript jsx
function App() {
    const [state, setState] = React.useState<State>(initialState);
    const setName:React.ChangeEventHandler<HTMLInputElement> = (e) => {
        state.inputName = e.target.value;
        setState({
            ...state,
            inputName: e.target.value
        });
    };
    const onSubmit = () => {
        const users = state.users;
        users.push(state.inputName);
        setState({
            ...state,
            users: users
        });
    };
    return (
        <div>
            name: <input type="text" value={state.inputName} onChange={setName}/>
            <button onClick={onSubmit}>submit</button>
            <Users users={state.users}/>
        </div>
    );
}
const Users = React.memo((props: {users: string[]}) => {
    return (
        <ul>
            {props.users.map((userName) => (
                <li>{userName}</li>
            ))}
        </ul>
    );
});

```