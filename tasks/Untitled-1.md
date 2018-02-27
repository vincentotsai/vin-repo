---
title: vue router
tags: router
notebook: Review  
---
!! 子路由不能带斜杠。
{
path: '/finance',
name: '财务管理',
component: Finance,
redirect: { name: '提现申请' },
children: [
{
path: 'encashment-operate',
name: '提现申请（运营）',
component: Eoperate
},
{
path: 'encashment-finance',
name: '提现申请（财务）',
component: Efinance
},

