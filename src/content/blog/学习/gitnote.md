---
title: 'git笔记'
pubDate: 2026-01-17
updated: 2026-01-18
---



##### 总是忘记，所以搬过来。



```
前端：
Node.js：是让 JavaScript 能在服务器上运行的基础环境。
nvm：Node.js 的版本管理工具，用于安装和切换多个 Node.js 版本。
pnpm：Node.js 的包管理工具，用于安装和管理Node.js项目的依赖。
Astro：是一个用 JavaScript/TypeScript 编写的、运行在 Node.js 环境之上的现代前端框架，用于高效地构建网站。
```



Git的意义——版本控制

实现的手段——分支

#### 1、安装

https://git-scm.com/install/

#### 2、配置

打开 git-bash.exe，

先**config**：配置一下自己的用户名、邮箱。

```
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱@example.com"
```

查看所有配置的命令：

```
git config --list
```

#### 3、使用

github的仓库默认是main 分支，而git本地仓库默认是master分支，听说现在的git版本也默认是main，为了减少一些不必要的麻烦，最好全部改成main。

git的修改：

```
git branch			# 查看所有分支，带 * 号的就是当前所在的分支。
git checkout <分支名>    # 就是切换到该分支，确保在要重命名的分支上

git branch -m master main	# 重命名当前master分支为main

git config --global init.defaultBranch main		# 设置以后新仓库都用 main 作为默认分支
```

github 的修改：

看到自己仓库页面左上标签Branches点击进去，新页面再点击 Settings齿轮 ，在 "Default branch" 部分点击分支名旁的 ✏️ 图标，将master重命名为`main` 分支，点击Update确认修改。刷新就是main分支了。

##### 1）在想要创建 Git 仓库的文件夹下进行**init **

在这个文件夹创建了一个空的 Git 仓库。add时才开始追踪。（提一嘴，现在是在说本地仓库，远程仓库在后头。）

```
git init
```

项目根目录下的  .git 隐藏文件夹 就是 git 的“魔法后台”：它存储了将来这个文件夹下以后新建的文件夹的所有历史版本。

##### 2）追踪

```
git add . 		# 只对当时文件夹里已经存在的文件有效。如果是在执行 add . 之后才把文件拖进来的，那么需要重新执行一次。
git add <文件名.文件扩展名>		# 后续简写为<文件名>
git add -p		# 交互式添加，git 会逐个显示每个变化块，问你是否要添加到暂存区
git restore --staged <不想提交的文件名>		# 发现不想提交的文件，可以从暂存区移除。
```

##### 3）正式提交

```
git commit -m "暂存区里的东西现在提交上去，这是本次提交的描述信息。"
```

需要修订提交信息或重新提交一个文件：

```
①  git add <文件名>
   git commit --amend --no-edit 或 git commit --amend -m "新信息"

③   git add <文件名> && git commit --amend --no-edit
```

##### 4）查看

a. 查看历史提交的描述信息：

```
git log --oneline
```

b. 查看历史版本的文件

```
git show <提交哈希>:<文件名>
```

按q回家。

```
git show <提交哈希> 子文件夹名/文件名
# 示例：
git show 596cd52 littleTest/helloGit.py
```

对比模式：

示例：对比 哈希号为c744c63的版本的 fintechsys.md与现在的 fintechsys.md，不管有没有在暂存区，直接被拿来对比了。

```
git diff c744c63 fintechsys.md
```

d. 查看文件状态

```
git status
```

e. 查看所有分支

```
git branch
带 * 号的就是当前所在的分支。
```

##### 5）新分支

在 main 分支查看：

```
git checkout main
```

如果想做个新分支，记得先提交当前的所有更改。

再创建并切换到新分支：

```
git checkout -b <起一个分支名>
```

##### 6）<mark>回滚</mark>、合并、删除

```
git reset --hard <哈希号>

git checkout main
git merge branch01

git branch -d branch01
```

变基合并（**Rebase** + Merge）历史更整洁但也危险：提交历史变成一条直线，没有分叉。自己玩用 rebase，团队协作用 merge。

```
# 1. 在特性分支上，将提交"重新播放"到main前面
git checkout branch01
git rebase main

# 2. 切换回main并快速合并
git checkout main
git merge branch01
```



#### 4、远程仓库

##### 1）关联

先到自己账号new一个仓库再过来。

有了远程仓库，可以开始关联了

```
git remote add <远程仓库简称> <你的远程仓库的链接>.git

# 示例，默认是origin，想关联别人的仓库再另外起名字

git remote add origin https://github.com/githubName/repositoryName.git
```

##### 2）拉取

**把当前所在的本地分支** 与 **远程的分支** 进行合并。如有冲突会报告的。⚠️ 需要**手动解决冲突**。

```
git pull <远程仓库简称> <本地分支名称>
```

强行覆盖：

```
git fetch origin
git reset --hard origin/main
```

学弟友情提示：记得提交再拉取。

##### 3）推送

```
git push <远程仓库简称> <本地分支名>
```

```
# 示例：
git push (-u) origin main   # -u 明确设置上游，以后可直接 git push

```



------

### 问1 如何推送到远程的第二个分支？——直接推

情况1：推送本地已有分支到远程

```bash
git checkout dev          # 切换到dev分支
git push origin dev       # 推送到远程，并创建同名的远程分支
```

情况2：远程已有新分支但本地无对应分支，可直接推送空分支到远程：

```bash
git push origin HEAD:new-branch  # 将当前分支推送到远程存在的一个分支 new-branch
```

其他：

```bash
origin          # 指整个远程仓库
origin/main     # 指远程仓库的 main 分支
git branch -r 或 git ls-remote --heads origin   # 查看远程分支
```

### 问2 远程分支的重命名与删除？

```bash
# 1. 重命名本地分支
git branch -m old-name new-name

# 2. 删除远程旧分支，本地删除是git branch -d branch01
git push -d origin old-name
git push origin --delete old-name

# 3. 推送新分支
git push origin new-name
```

### 问3 fetch怎么用？——先下载查看，再合并

```bash
git fetch (--all)
git fetch origin	# 指定远程仓库（当项目有多个远程仓库时）

git log --all --oneline --graph
git log HEAD..origin/main --oneline
git log origin/main --oneline -5

git diff HEAD origin/main	# HEAD 表示当前分支
git diff main origin/main

git merge origin/main 或 git rebase origin/main

git push origin main
```

其他：

```bash
git fetch origin dev	# 只 fetch 某个分支dev
git branch -r		# 查看所有远程分支
git remote show dev		# 查看远程分支详情
git checkout -b dev origin/dev # 创建本地分支跟踪远程dev细细查看和编辑这个分支

# 如果远程分支已删除，本地还有记录，清理旧的远程分支引用
git fetch --prune 或 git remote prune origin
```



```
thanks.
```



