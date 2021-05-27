#!/bin/sh
 
git filter-branch -f --env-filter '
 
an="$GIT_AUTHOR_NAME"
am="$GIT_AUTHOR_EMAIL"
cn="$GIT_COMMITTER_NAME"
cm="$GIT_COMMITTER_EMAIL"
 
if [ "$GIT_COMMITTER_EMAIL" = "6061960@163.com" ]
then
    cm="zhangqi444@gmial.com"
    cn="zhangqi444"
fi
if [ "$GIT_AUTHOR_EMAIL" = "6061960@163.com" ]
then
    am="zhangqi444@gmail.com"
    an="zhangqi444"
fi
 
# export GIT_AUTHOR_NAME="$an"
export GIT_AUTHOR_EMAIL="$am"
# export GIT_COMMITTER_NAME="$cn"
export GIT_COMMITTER_EMAIL="$cm"
'
