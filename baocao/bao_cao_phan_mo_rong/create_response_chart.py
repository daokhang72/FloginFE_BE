#!/usr/bin/env python3
"""
Script tạo biểu đồ Response Time Analysis cho báo cáo Performance Testing
"""

import matplotlib.pyplot as plt
import numpy as np
import os

# Dữ liệu từ kết quả test thực tế (cập nhật từ ảnh screenshot)
metrics = ['Average', 'Min', 'p(90)', 'p(95)', 'Max']

# Login API response times (ms)
login_api = [4.07, 1.51, 4.86, 5.40, 297.75]

# Product API response times (ms)
product_api = [5.28, 1.10, 7.58, 8.80, 241.45]

# Tạo biểu đồ
def create_chart():
    # Set style
    plt.style.use('seaborn-v0_8-darkgrid')
    
    # Vị trí các thanh
    x = np.arange(len(metrics))
    width = 0.35
    
    # Tạo figure và axes
    fig, ax = plt.subplots(figsize=(14, 7))
    
    # Vẽ các thanh
    bars1 = ax.bar(x - width/2, login_api, width, 
                   label='Login API', 
                   color='#4CAF50',
                   edgecolor='black',
                   linewidth=1.2)
    
    bars2 = ax.bar(x + width/2, product_api, width, 
                   label='Product API', 
                   color='#2196F3',
                   edgecolor='black',
                   linewidth=1.2)
    
    # Thêm labels và title
    ax.set_xlabel('Performance Metrics', fontsize=14, fontweight='bold')
    ax.set_ylabel('Response Time (milliseconds)', fontsize=14, fontweight='bold')
    ax.set_title('Response Time Analysis - Login API vs Product API\nPerformance Testing with k6 (1000 concurrent users)', 
                 fontsize=16, fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(metrics, fontsize=12)
    ax.legend(fontsize=12, loc='upper left')
    
    # Grid
    ax.grid(True, axis='y', alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)
    
    # Thêm giá trị trên mỗi cột
    def autolabel(bars):
        for bar in bars:
            height = bar.get_height()
            ax.annotate(f'{height:.2f} ms',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 5),
                        textcoords="offset points",
                        ha='center', va='bottom', 
                        fontsize=10,
                        fontweight='bold')
    
    autolabel(bars1)
    autolabel(bars2)
    
    # Thêm note ở dưới
    fig.text(0.5, 0.02, 
             'Note: Lower values indicate better performance. p(95) means 95% of requests completed within this time.',
             ha='center', fontsize=10, style='italic', color='gray')
    
    # Adjust layout
    plt.tight_layout()
    
    # Tạo thư mục nếu chưa có
    output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'images')
    os.makedirs(output_dir, exist_ok=True)
    
    # Lưu ảnh
    output_path = os.path.join(output_dir, 'response_time_analysis.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
    
    print(f"✅ Biểu đồ đã được tạo thành công!")
    print(f"📁 Đường dẫn: {os.path.abspath(output_path)}")
    print(f"📊 Kích thước: 14x7 inches, 300 DPI")
    
    # Hiển thị biểu đồ
    plt.show()

# Tạo biểu đồ dạng line chart (alternative)
def create_line_chart():
    plt.style.use('seaborn-v0_8-whitegrid')
    
    fig, ax = plt.subplots(figsize=(14, 7))
    
    x = np.arange(len(metrics))
    
    # Plot lines
    ax.plot(x, login_api, marker='o', linewidth=3, markersize=10, 
            label='Login API', color='#4CAF50')
    ax.plot(x, product_api, marker='s', linewidth=3, markersize=10, 
            label='Product API', color='#2196F3')
    
    # Labels
    ax.set_xlabel('Performance Metrics', fontsize=14, fontweight='bold')
    ax.set_ylabel('Response Time (milliseconds)', fontsize=14, fontweight='bold')
    ax.set_title('Response Time Trend Analysis\nLogin API vs Product API', 
                 fontsize=16, fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(metrics, fontsize=12)
    ax.legend(fontsize=12, loc='upper left')
    
    # Grid
    ax.grid(True, alpha=0.3, linestyle='--')
    
    # Thêm giá trị
    for i, (login_val, product_val) in enumerate(zip(login_api, product_api)):
        ax.text(i, login_val + 5, f'{login_val:.2f}', ha='center', va='bottom', 
                fontsize=9, fontweight='bold', color='#4CAF50')
        ax.text(i, product_val + 5, f'{product_val:.2f}', ha='center', va='bottom', 
                fontsize=9, fontweight='bold', color='#2196F3')
    
    plt.tight_layout()
    
    # Lưu
    output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'images')
    output_path = os.path.join(output_dir, 'response_time_line_chart.png')
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
    
    print(f"✅ Line chart đã được tạo!")
    print(f"📁 Đường dẫn: {os.path.abspath(output_path)}")

if __name__ == '__main__':
    print("=" * 60)
    print("  Response Time Analysis Chart Generator")
    print("  Performance Testing Report - Flogin Project")
    print("=" * 60)
    print()
    
    try:
        import matplotlib
        print(f"✓ Matplotlib version: {matplotlib.__version__}")
    except ImportError:
        print("❌ Lỗi: Chưa cài đặt matplotlib")
        print("   Chạy lệnh: pip install matplotlib")
        exit(1)
    
    print()
    print("Chọn loại biểu đồ:")
    print("1. Bar Chart (Khuyên dùng)")
    print("2. Line Chart")
    print("3. Cả hai")
    
    choice = input("\nNhập lựa chọn (1/2/3): ").strip()
    
    print()
    if choice == '1':
        create_chart()
    elif choice == '2':
        create_line_chart()
    elif choice == '3':
        create_chart()
        print()
        create_line_chart()
    else:
        print("Lựa chọn không hợp lệ. Tạo Bar Chart mặc định...")
        create_chart()
    
    print()
    print("=" * 60)
    print("  Hoàn thành! Kiểm tra thư mục images/")
    print("=" * 60)
