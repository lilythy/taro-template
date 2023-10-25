```javascript
// 同列表目标 选择器，可用于 起始层级，p6 - p9, 目前并没有做前后选择限制，可以 先选择 p9 然后选择 p6
<SameCascader
  options={options}
  level={2}
  title="岗位选择"
  onChange={e => {
    console.log(e);
  }}
  value={['147aecae-45cb-49ea-ae4a-2a1fc289e123', '21612368-901b-466f-82f5-c0ef05f8db43']}
/>;

// 普通的级联选择器，可以只选择父级
<Cascader
  options={options}
  title="岗位选择"
  onChange={e => {
    console.log(e);
  }}
  value={'bae9a57b-89f9-4ea4-9f2e-cfc4c5a677d8'}
/>;
// 普通的级联选择器，必须选择完整/ 未选择的情况 才可以确定
<Cascader
  options={options}
  title="岗位选择"
  onChange={e => {
    console.log(e);
  }}
  chooseEnd
  value={'bae9a57b-89f9-4ea4-9f2e-cfc4c5a677d8'}
/>;
// 普通的级联选择器，如果没有children的话，则认为选择完毕
<Cascader
  options={options[0]?.children || []}
  title="岗位选择"
  onChange={e => {
    console.log(e);
  }}
  value={'e936f9e7-aeb7-42d9-bb5b-1c68b12f0f73'}
/>;
```
