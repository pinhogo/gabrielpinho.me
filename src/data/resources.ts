import type { ResourceItem } from '../types/portfolio'

export const RESOURCE_ITEMS: ResourceItem[] = [
  {
    id: 'arch-bootstrap',
    filename: 'arch-bootstrap.sh',
    description: 'Arch linux / workstop setup',
    extension: '.sh',
    actionType: 'copy',
    size: '4.2 KB',
    copyPayload:
      '#!/usr/bin/env bash\nset -euo pipefail\nsudo pacman -Syu --needed git base-devel zsh neovim tmux fzf ripgrep',
  },
  {
    id: 'java-collections',
    filename: 'java-collections.pdf',
    description: 'PUCRS / coletor de nodes',
    extension: '.pdf',
    actionType: 'download',
    size: '128 KB',
    downloadUrl: 'https://github.com/pinhogo',
  },
  {
    id: 'git-recovery',
    filename: 'git-recovery.md',
    description: 'Reflag, rescs & hackers',
    extension: '.md',
    actionType: 'copy',
    size: '8.6 KB',
    copyPayload:
      'git reflog --date=iso\ngit checkout -b recovery-branch HEAD@{1}\ngit cherry-pick <commit-hash>',
  },
  {
    id: 'automatos-resumo',
    filename: 'automatos-resumo.pdf',
    description: 'PUCRS / recanto de reset',
    extension: '.pdf',
    actionType: 'download',
    size: '245 KB',
    downloadUrl: 'https://github.com/pinhogo',
  },
  {
    id: 'shell-aliases',
    filename: 'shell-aliases.sh',
    description: 'daily artillery / zsh',
    extension: '.sh',
    actionType: 'copy',
    size: '2.1 KB',
    copyPayload:
      'alias gs="git status -sb"\nalias gl="git log --oneline --graph --decorate -n 15"\nalias gp="gh project item-list 5 --owner pinhogo"',
  },
]
