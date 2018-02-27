---
title: vim保存&放弃保存命令
tags: vim, vi, 保存
notebook: Work
---

在命令模式中，连按两次大写字母Z，若当前编辑的文件曾被修改过，则Vi保存该文件后退出，返回到shell；若当前编辑的文件没被修改过，则Vi直接退出,   返回到shell。   

  　　在末行模式下，输入命令   

  　　:w 

  　　Vi保存当前编辑文件，但并不退出，而是继续等待用户输入命令。在使用w命令时，可以再给编辑文件起一个新的文件名。

  　　[例6]   

  　　:w   newfile 

  　　此时Vi将把当前文件的内容保存到指定的newfile中，而原有文件保持不变。若newfile是一个已存在的文件，则Vi在显示窗口的状态行给出提示信息： 

  　　File   exists   (use   !   to   override) 

  　　此时，若用户真的希望用文件的当前内容替换newfile中原有内容，可使用命令 

  　　:w!   newfile 

  　　否则可选择另外的文件名来保存当前文件。 

  　　在末行模式下，输入命令   

  　　:q 

  　　系统退出Vi返回到shell。若在用此命令退出Vi时，编辑文件没有被保存，则Vi在显示窗口的最末行显示如下信息： 

  　　No   write   since   last   change   (use   !   to   overrides) 

  　　提示用户该文件被修改后没有保存，然后Vi并不退出，继续等待用户命令。若用户就是不想保存被修改后的文件而要强行退出Vi时，可使用命令 

  　　:q! 

  　　Vi放弃所作修改而直接退到shell下。 

  　　在末行模式下，输入命令   

  　　:wq 

  　　Vi将先保存文件，然后退出Vi返回到shell。 

  　　在末行模式下，输入命令   

  　　:x 

  　　该命令的功能同命令模式下的ZZ命令功能相同