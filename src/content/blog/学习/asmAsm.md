---
title: '汇编代码'
pubDate: 2025-12-15
---

### 1.1 将 (`'47'` 和 `'69'`) 进行相加（即 `47+69`），计算并显示其十进制结果（`'116'`）。

```
字符 '0' = 48D = 30H
字符 '1' = 49D = 31H  
字符 '2' = 50D = 32H
字符 '3' = 51D = 33H
字符 '4' = 52D = 34H
字符 '5' = 53D = 35H
字符 '6' = 54D = 36H
字符 '7' = 55D = 37H
字符 '8' = 56D = 38H
字符 '9' = 57D = 39H

题外话1：AAD —— ASCII Adjust for Division
MOV AH, '4'      ; AH = 34H
MOV AL, '7'      ; AL = 37H
SUB AX, 3030H    ; AH = 04H, AL = 07H
AAD              ; AX = 04*10 + 07 = 47 (002FH)
                 ; 现在AX中是真正的二进制数47，可以直接进行数学运算
题外话2：AAA —— ASCII Adjust After Addition
电脑是怎么"笨笨地"算的：
电脑算 7 + 9：
电脑里：7 = 00000111，9 = 00001001
直接加：00000111 + 00001001 = 00010000（这是16，写成十六进制是10H）
问题来了：
电脑得到的 10H（十六进制的16）中：
1 在"十六进制的十位"（实际是16的1）
0 在个位
但我们要的是十进制的16，应该是：
十位 = 1
个位 = 6
AAA来救场了！
AAA看到 10H，心想："哦！这看起来像是有进位的情况（因为低4位加出了16）。"于是它做两件事：
给个位加6：10H + 6 = 16H，然后只留下个位6
给十位加1：把进位1存到AH寄存器里
结果：
AL（个位寄存器） = 6
AH（十位/进位寄存器） = 原来的AH + 1
```

 

```asm
DATA    SEGMENT    
VAL1    BYTE '47'
VAL2    BYTE '69'
RES     BYTE 4 DUP (?)
DATA    ENDS

STACK   SEGMENT STACK 'STACK'    
BYTE    100 DUP (?)
STACK   ENDS

CODE    SEGMENT            
ASSUME CS:CODE, DS:DATA, SS:STACK

START:
    MOV AX, DATA        
    MOV DS, AX          

    ; 计算个位 7+9
    MOV AL, VAL1+1
    SUB AL, '0'
    MOV BL, VAL2+1
    SUB BL, '0'
    ADD AL, BL
    AAA
    MOV RES+2, AL
    
    ; 计算十位 4+6+进位
    MOV AL, VAL1
    SUB AL, '0'
    MOV BL, VAL2
    SUB BL, '0'
    ADD AL, BL
    ADD AL, AH
    MOV AH, 0
    AAA
    MOV RES+1, AL
    
    ; 处理百位
    ADD AH, '0'
    MOV RES, AH
    
    ; 转换为ASCII
    ADD RES+2, '0'
    ADD RES+1, '0'

    MOV RES+3, '$'
    
    MOV DX, OFFSET RES
    MOV AH, 9    
    INT 21H
    
    MOV AH, 4CH    
    INT 21H        
CODE    ENDS
END START
```
 

#### 2.1 查表转换。使用 `XLAT` 指令，将一个BCD码数字 (`05H`) 通过七段数码管码表，转换为对应的段码，并存储结果。

 

```asm
.MODEL	SMALL
.STACK  	64
.DATA
TABLE7	BYTE  3FH,06H,5BH,4FH,66H,6DH,7DH,07H,7FH,6FH
VALBCD	BYTE 05H
RES7	BYTE  ?	
.CODE
.STARTUP	
MOV BX, OFFSET TABLE7
MOV AL, VALBCD
XLAT            
MOV RES7, AL
.EXIT		
END 
```
 

#### 3.1 显示一条信息，等待用户输入。如果用户输入 `'Y'`，则显示一条特定信息；否则显示另一条。

 

```asm
DISP	MACRO	STR
MOV DX, OFFSET STR
MOV AH, 9
INT 21H
ENDM
.MODEL	SMALL
.STACK	64
.DATA
PROMPT1  BYTE 'There is a message for you from NEO.', SPACE
BYTE 'To read it enter Y','$'
MESSAGE   BYTE CR, LF, 'HI! I will meet you in the Matrix in 3009.', '$'
PROMPT2  BYTE	CR, LF, 'No more messages for you.', '$'
CR 	EQU	0DH	
LF	EQU	0AH
SPACE	EQU	20H
.CODE
START:	MOV AX,@DATA
MOV DS,AX
DISP PROMPT1
MOV AH, 7
INT 21H
CMP AL, 'Y'
JZ OVER
DISP PROMPT2
JMP EXIT
OVER:	DISP MESSAGE
EXIT:	MOV AH,4CH
INT 21H
END START
```
 

#### 4.1 计算 `{10*(X+Y) - 3*(Z-1)} / 2`。
 
```asm
TITLE    EXAMPLE  PROGRAM
DATA  SEGMENT	;设置数据段
VARX	DW    123H	;变量X
VARY	DW    456H	;变量Y
VARZ	DW    789H	;变量Z
FUN		DW    ?	;结果单元
DATA   	ENDS
STACK1  	SEGMENT   PARA  STACK;设置堆栈段
DW   20H   DUP(0)
STACK1  	ENDS
CODE	SEGMENT		;设置代码段
ASSUME   CS: CODE, DS: DATA, SS: STACK1
START:	MOV	  AX, DATA	;置段基值于DS
MOV	  DS, AX
MOV	  AX, VARX	;取变量X
ADD	  AX, VARY	;AX =（X+Y）
MOV	  BX, AX	;BX =（X+Y）
SAL	  AX, 1		;AX=2*（X+Y）
SAL	  AX, 1		;AX = 4*（X+Y）
ADD	  AX, BX	;AX = 5*（X+Y）
SAL	  AX, 1		;AX = 10*（X+Y）
MOV	  BX, VARZ	;取变量Z
DEC	  BX		;BX =（Z-1）
MOV	  CX, BX	;CX =（Z-1）
SAL	  BX, 1		;BX = 2*（Z-1）
ADD	  BX, CX	;BX = 3*（Z-1）
SUB	  AX, BX	;AX = 10*(X+Y)- 3*(Z-1)
SAR	  AX, 1		;AX = {10*(X+Y)- 3*(Z-1)}/2
MOV	  FUN,AX	;存放计算结果
MOV	  AH,4CH	;终止用户程序，返回DOS
INT	  21H
CODE	ENDS
END  START
```
 

#### 5.1 基于固定值的跳转表法的（A+, A, A-, B+, B）。
 
```asm
.MODEL SMALL
.DATA
SCORE BYTE 60
AP BYTE 'A+','$'
A BYTE 'A','$'
AM BYTE 'A-','$'
BPL BYTE 'B+','$'
B BYTE 'B','$'
J_TAB WORD L1 ,L2,L3,L4,L5
.CODE
START: MOV AX, @DATA ;初始化段寄存器
MOV DS, AX
XOR AH,AH
MOV AL,SCORE ;
SUB AL,60   ; AL=AL-60
MOV BL,10   ; BL =10
DIV BL      ; 将分数段划分为 10 分一个区间 AL/10，商存入AL，余数存入AH
MOV BL,AL   ; 将商从AL传到BL
XOR BH,BH   ; 实现多分支的程序段, 使得BX寄存器的高8位为0
SHL BX,1    ; 计算2*(PARAM)
JMP J_TAB[BX]; 根据索引跳转到跳转表
L1: MOV DX,OFFSET B
MOV AH,9  ; 显示
INT 21H
JMP NEXT
L2: MOV DX,OFFSET BPL
MOV AH,9
INT 21H
JMP NEXT
L3: MOV DX,OFFSET AM
MOV AH,9
INT 21H
JMP NEXT
L4: MOV DX,OFFSET A
MOV AH,9
INT 21H
JMP NEXT
L5: MOV DX,OFFSET AP
MOV AH,9
INT 21H
JMP NEXT
NEXT: MOV AH, 4CH
INT 21H
END START
```
 
#### 5.2 带输入的跳转表法。
 
```asm
DATA SEGMENT
buf   db 3        ;缓冲区长度
db ?        ;实际输入个数
str1  db 3 DUP(?) ;存储空间

score db 87
disp   db 0dh, 0ah
grade db ?,'$'

; 跳转表：存储各个分支的地址
jmp_table dw branch1, branch2, branch3, branch4
DATA ENDS

STACK1 SEGMENT PARA STACK
DW 40H DUP(?)
STACK1 ENDS

CODE SEGMENT
ASSUME CS:CODE , DS:DATA
START: MOV AX,DATA
MOV DS,AX
mov dx, offset buf
mov ah, 0ah
int 21h

;=(str1[0]-'0')*10+(str1[1]-'0')=
mov al, str1[0]
sub al,'0'
mov bl, 10
mul bl
mov bl, str1[1]
sub bl, '0'
add al, bl

; 将成绩存入score变量
mov score, al

; 使用跳转表法判断等级
mov al, score
cmp al, 90
jae level0      ; >=90 跳转到level0
cmp al, 80
jae level1      ; >=80 跳转到level1
cmp al, 70
jae level2      ; >=70 跳转到level2
jmp level3      ; 其他情况跳转到level3
level0:
mov bx, 0       ; 对应branch1在跳转表中的索引0
jmp do_jump
level1:
mov bx, 2       ; 对应branch2在跳转表中的索引1（每个地址占2字节）
jmp do_jump
level2:
mov bx, 4       ; 对应branch3在跳转表中的索引2
jmp do_jump
level3:
mov bx, 6       ; 对应branch4在跳转表中的索引3

do_jump:
; 使用跳转表进行跳转
jmp jmp_table[bx]

branch1:  
mov ah,'A'
jmp finish
branch2: 
mov ah,'B'
jmp finish
branch3: 
mov ah,'C'
jmp finish
branch4:
mov ah,'D'

finish:      
mov grade, ah  
; 显示结果
mov dx, offset disp
mov ah, 9
int 21h    

MOV AH,4CH
INT 21H

CODE ENDS
END START
```
 
#### 5.3 带输入的条件分支判断法。
 
```asm
DATA SEGMENT
  buf   db 3		;缓冲区长度
          db ?		;实际输入个数
  str1  db 3 DUP(?)	;存储空间

  score db 87
  disp   db 0dh, 0ah
  grade db ?,'$'

DATA ENDS

STACK1 SEGMENT PARA STACK
DW 40H DUP(?)
STACK1 ENDS

CODE SEGMENT
	ASSUME CS:CODE , DS:DATA
START:	MOV AX,DATA
	MOV DS,AX
mov dx, offset buf
mov ah, 0ah
int 21h

;=(str1[0]-'0')*10+(str1[1]-'0')=
mov al, str1[0]
sub al,'0'
mov bl, 10
mul bl
mov bl, str1[1]
sub bl, '0'
add al, bl

;mov al,score
cmp al,90
jge branch1
cmp al,80
jge branch2
cmp al,70
jge branch3
mov ah,'D'
jmp finish
branch1:  mov ah,'A'
	jmp finish
branch2: mov ah,'B'
	jmp finish
branch3: mov ah,'C'
	jmp finish
finish:
    mov grade, ah       ; 存储等级字符到内存
    mov dx, offset disp ; 设置要显示的字符串地址
    mov ah,9            ; 功能号9：显示字符串
    int 21h             ; 调用DOS中断显示结果
    
MOV AH,4CH              ; 功能号4Ch：程序结束
INT 21H                 ; 调用DOS中断结束程序

CODE ENDS
END START
```
 
#### 6.1 利用循环——统计字符串中各类字符的个数

- `A`：统计**大写字母**的个数
- `B`：统计**小写字母**的个数
- `C`：统计**数字**的个数
- `D`：统计**其他字符**的个数

 
```asm
DATA SEGMENT
A DB 0
B DB 0
C DB 0
D DB 0
STRING DB 'ABBC34234a'
COUNT EQU $-STRING
DATA ENDS
STACK1 SEGMENT PARA STACK
DW 20H DUP(?)
STACK1 ENDS
CODE SEGMENT
ASSUME CS:CODE , DS:DATA
START:	
MOV AX,DATA
MOV DS,AX
MOV CX,COUNT   ;处理字符的个数CX = 字符串长度(10)
MOV SI,0
AGAIN:	
MOV AL,STRING[SI]
CMP AL,'A'
JB NEXT1		
CMP AL,'Z'
JBE RES1
NEXT1:	
CMP AL,'a'
JB NEXT2
CMP AL,'z'
JBE RES2
NEXT2:	
CMP AL,'0'
JB NEXT3
CMP AL,'9'
JBE RES3
NEXT3:	
INC D
JMP FIN
RES1:	
INC A
JMP FIN
RES2:	
INC B
JMP FIN
RES3:	
INC C
JMP FIN
FIN:	
INC SI
LOOP AGAIN ;CX--
MOV AH,4CH
INT 21H
CODE ENDS
END START
```
 

 
	thanks.
 
