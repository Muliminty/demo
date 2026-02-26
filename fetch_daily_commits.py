#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
多项目 Git 提交记录爬取脚本
用于获取指定项目当天的提交记录，并按项目分组输出
"""

import subprocess
import os
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
import sys


class GitCommitFetcher:
    def __init__(self, projects: Dict[str, str]):
        """
        初始化
        
        Args:
            projects: 项目字典，格式为 {项目名称: 项目路径}
        """
        self.projects = projects
        self.today = datetime.now().strftime("%Y-%m-%d")
    
    def get_today_commits(self, project_path: str) -> List[Dict[str, str]]:
        """
        获取指定项目当天的提交记录
        
        Args:
            project_path: 项目路径
            
        Returns:
            提交记录列表，每个记录包含 hash, message, body
        """
        if not os.path.exists(project_path):
            print(f"警告: 项目路径不存在: {project_path}", file=sys.stderr)
            return []
        
        if not os.path.exists(os.path.join(project_path, '.git')):
            print(f"警告: 不是 Git 仓库: {project_path}", file=sys.stderr)
            return []
        
        try:
            # 获取当天的提交记录
            # 使用分隔符来区分不同的提交
            cmd = [
                'git', 'log',
                '--since', f'{self.today} 00:00:00',
                '--until', f'{self.today} 23:59:59',
                '--pretty=format:%H%n%an%n%ad%n%s%n%b%n---COMMIT_END---',
                '--date=format:%Y-%m-%d %H:%M:%S'
            ]
            
            result = subprocess.run(
                cmd,
                cwd=project_path,
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            
            if result.returncode != 0:
                print(f"警告: 获取提交记录失败 ({project_path}): {result.stderr}", file=sys.stderr)
                return []
            
            commits = []
            lines = result.stdout.strip().split('\n')
            
            i = 0
            while i < len(lines):
                if lines[i].strip() == '---COMMIT_END---':
                    i += 1
                    continue
                
                commit = {
                    'hash': lines[i].strip() if i < len(lines) else '',
                    'author': lines[i+1].strip() if i+1 < len(lines) else '',
                    'date': lines[i+2].strip() if i+2 < len(lines) else '',
                    'subject': lines[i+3].strip() if i+3 < len(lines) else '',
                    'body': ''
                }
                
                # 收集 body 部分（直到遇到分隔符）
                i += 4
                body_lines = []
                while i < len(lines) and lines[i].strip() != '---COMMIT_END---':
                    body_lines.append(lines[i])
                    i += 1
                
                commit['body'] = '\n'.join(body_lines).strip()
                
                if commit['subject']:  # 只添加有主题的提交
                    commits.append(commit)
            
            return commits
            
        except Exception as e:
            print(f"错误: 处理项目时出错 ({project_path}): {str(e)}", file=sys.stderr)
            return []
    
    def format_commit_message(self, commit: Dict[str, str]) -> str:
        """
        格式化提交信息
        
        Args:
            commit: 提交记录字典
            
        Returns:
            格式化后的字符串
        """
        subject = commit.get('subject', '').strip()
        body = commit.get('body', '').strip()
        
        # 如果 subject 为空，跳过
        if not subject:
            return ''
        
        result = f"- {subject}\n"
        
        # 处理 body，按行分割并添加缩进
        if body:
            body_lines = [line.strip() for line in body.split('\n') if line.strip()]
            for line in body_lines:
                # 如果行以 - 开头，保持原样；否则添加缩进和 -
                if line.startswith('-'):
                    result += f"  {line}\n"
                else:
                    result += f"  - {line}\n"
            result += "\n"
        
        return result
    
    def generate_report(self, group_by_project: bool = False) -> str:
        """
        生成报告
        
        Args:
            group_by_project: 是否按项目分组显示
            
        Returns:
            格式化的报告字符串
        """
        report = f"## {self.today}\n```\n"
        
        has_commits = False
        
        # 按项目分组
        for project_name, project_path in self.projects.items():
            commits = self.get_today_commits(project_path)
            
            if commits:
                has_commits = True
                
                # 如果需要按项目分组，添加项目标题
                if group_by_project:
                    report += f"\n### {project_name}\n\n"
                
                for commit in commits:
                    formatted = self.format_commit_message(commit)
                    if formatted:
                        report += formatted
        
        if not has_commits:
            report += "- 今天没有提交记录\n"
        
        report += "```\n"
        
        return report
    
    def save_to_file(self, output_file: Optional[str] = None):
        """
        保存报告到文件
        
        Args:
            output_file: 输出文件路径，如果为 None 则输出到标准输出
        """
        report = self.generate_report()
        
        if output_file:
            # 如果文件已存在，检查是否已有今天的记录
            if os.path.exists(output_file):
                with open(output_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 如果已有今天的记录，替换它
                if f"## {self.today}" in content:
                    # 找到今天的记录开始和结束位置
                    start_marker = f"## {self.today}"
                    start_idx = content.find(start_marker)
                    
                    if start_idx != -1:
                        # 找到下一个日期标记或文件结尾
                        next_date_idx = content.find("\n## ", start_idx + len(start_marker))
                        if next_date_idx == -1:
                            # 没有下一个日期，替换到文件结尾
                            new_content = content[:start_idx] + report
                        else:
                            # 替换到下一个日期之前
                            new_content = content[:start_idx] + report + content[next_date_idx:]
                        
                        with open(output_file, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                    else:
                        # 追加到文件开头
                        with open(output_file, 'r+', encoding='utf-8') as f:
                            old_content = f.read()
                            f.seek(0)
                            f.write(report + "\n" + old_content)
                else:
                    # 追加到文件开头
                    with open(output_file, 'r+', encoding='utf-8') as f:
                        old_content = f.read()
                        f.seek(0)
                        f.write(report + "\n" + old_content)
            else:
                # 文件不存在，直接创建
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(report)
            
            print(f"报告已保存到: {output_file}")
        else:
            print(report)


def load_config(config_file: str = 'projects_config.json') -> tuple:
    """
    从配置文件加载项目配置
    
    Args:
        config_file: 配置文件路径
        
    Returns:
        (projects, output_file) 元组
    """
    if os.path.exists(config_file):
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
                projects = config.get('projects', {})
                output_file = config.get('output_file', None)
                return projects, output_file
        except Exception as e:
            print(f"警告: 读取配置文件失败: {e}", file=sys.stderr)
    
    return {}, None


def main():
    """
    主函数
    支持从配置文件、命令行参数或代码中配置项目路径
    """
    projects = {}
    output_file = None
    
    # 1. 尝试从配置文件加载
    config_file = 'projects_config.json'
    if os.path.exists(config_file):
        projects, output_file = load_config(config_file)
        print(f"从配置文件加载: {config_file}")
    
    # 2. 如果通过命令行参数传入项目路径，使用命令行参数
    if len(sys.argv) > 1:
        # 命令行格式: python script.py project1:path1 project2:path2 ...
        projects = {}
        for arg in sys.argv[1:]:
            if arg.startswith('--config='):
                # 指定配置文件
                config_file = arg.split('=', 1)[1]
                projects, output_file = load_config(config_file)
            elif ':' in arg:
                name, path = arg.split(':', 1)
                projects[name] = path
            elif arg.startswith('--output='):
                output_file = arg.split('=', 1)[1]
            else:
                # 如果没有冒号，使用路径的最后一部分作为名称
                projects[os.path.basename(arg)] = arg
    
    # 3. 如果还是没有项目配置，使用默认配置
    if not projects:
        projects = {
            '项目A': '/path/to/project-a',
            '项目B': '/path/to/project-b',
            '项目C': '/path/to/project-c',
        }
        print("使用默认配置，请修改脚本或创建配置文件")
    
    # 创建爬取器
    fetcher = GitCommitFetcher(projects)
    
    # 如果没有指定输出文件，使用配置文件中的或默认值
    if output_file is None:
        output_file = '自动化 git 记录脚本.md'
    
    # 生成并保存报告
    fetcher.save_to_file(output_file)


if __name__ == '__main__':
    main()
