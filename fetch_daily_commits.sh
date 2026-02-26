#!/bin/bash
# 多项目 Git 提交记录爬取脚本 (Shell 版本)
# 用于获取指定项目当天的提交记录，并按项目分组输出

# 配置项目路径（修改这里）
declare -A PROJECTS=(
    ["项目A"]="/path/to/project-a"
    ["项目B"]="/path/to/project-b"
    ["项目C"]="/path/to/project-c"
)

# 输出文件路径（可选，留空则输出到标准输出）
OUTPUT_FILE="自动化 git 记录脚本.md"

# 获取今天的日期
TODAY=$(date +"%Y-%m-%d")

# 生成报告
generate_report() {
    echo "## $TODAY"
    echo '```'
    
    local has_commits=false
    
    # 遍历每个项目
    for project_name in "${!PROJECTS[@]}"; do
        project_path="${PROJECTS[$project_name]}"
        
        # 检查路径是否存在
        if [ ! -d "$project_path" ]; then
            echo "警告: 项目路径不存在: $project_path" >&2
            continue
        fi
        
        if [ ! -d "$project_path/.git" ]; then
            echo "警告: 不是 Git 仓库: $project_path" >&2
            continue
        fi
        
        # 获取当天的提交记录
        commits=$(cd "$project_path" && git log \
            --since="$TODAY 00:00:00" \
            --until="$TODAY 23:59:59" \
            --pretty=format:"%s|%b" \
            2>/dev/null)
        
        if [ -n "$commits" ]; then
            has_commits=true
            
            # 处理每个提交
            echo "$commits" | while IFS='|' read -r subject body; do
                if [ -n "$subject" ]; then
                    echo "- $subject"
                    
                    # 处理 body
                    if [ -n "$body" ]; then
                        echo "$body" | while IFS= read -r line; do
                            line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
                            if [ -n "$line" ]; then
                                if [[ "$line" =~ ^- ]]; then
                                    echo "  $line"
                                else
                                    echo "  - $line"
                                fi
                            fi
                        done
                        echo ""
                    fi
                fi
            done
        fi
    done
    
    if [ "$has_commits" = false ]; then
        echo "- 今天没有提交记录"
    fi
    
    echo '```'
}

# 保存到文件或输出到标准输出
if [ -n "$OUTPUT_FILE" ]; then
    # 如果文件已存在，检查是否已有今天的记录
    if [ -f "$OUTPUT_FILE" ] && grep -q "## $TODAY" "$OUTPUT_FILE"; then
        # 替换今天的记录
        report=$(generate_report)
        
        # 使用 awk 或 sed 替换（这里用临时文件方式）
        awk -v today="$TODAY" -v new_report="$report" '
            BEGIN { in_today = 0; printed = 0 }
            /^## / {
                if ($2 == today) {
                    in_today = 1
                    print new_report
                    printed = 1
                    next
                } else {
                    in_today = 0
                }
            }
            !in_today { print }
            in_today && /^```$/ && printed {
                # 跳过旧记录直到下一个日期
                while (getline > 0) {
                    if (/^## /) {
                        print
                        in_today = 0
                        break
                    }
                }
            }
        ' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"
        
        echo "报告已更新: $OUTPUT_FILE"
    else
        # 追加到文件开头
        report=$(generate_report)
        {
            echo "$report"
            echo ""
            [ -f "$OUTPUT_FILE" ] && cat "$OUTPUT_FILE"
        } > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"
        
        echo "报告已保存到: $OUTPUT_FILE"
    fi
else
    generate_report
fi
