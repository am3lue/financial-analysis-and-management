# 📊 Financial Analysis & Management

**Financial Analysis & Management** is a comprehensive, privacy-focused web application designed to help individuals and small businesses track their weekly income and expenses with ease. Built with modern web technologies, it offers real-time analysis, visual reporting, and secure local data persistence—no accounts or servers required.

![Project Banner](images/images.svg)

---

## 🌟 Key Features

### 📝 Smart Tracking
- **Daily Dashboard**: Intuitive interface to record income and expenses for every day of the week.
- **Extra Expenses**: Flexible category management for irregular costs (e.g., "Groceries", "Transport").
- **Real-Time Calculations**: Instantly see your total income, expenses, and net profit as you type.

### 📊 Powerful Analytics
- **Weekly Reports**: comprehensive breakdown of your financial performance.
- **Best/Worst Days**: Automatically identifies your most and least profitable days.
- **Visual Charts**: Interactive bar and pie charts (powered by a custom lightweight charting library) to visualize income vs. expenses.
- **Profit Margin**: Calculates your profit margin percentage to help you gauge efficiency.

### 🔒 Privacy & Convenience
- **Local Storage**: All data is saved directly in your browser's local storage. Your financial data never leaves your device.
- **Auto-Save**: Never lose your progress; data is saved automatically on every input.
- **Export/Import**: Backup your data to a JSON file or transfer it to another device easily.
- **Dark Mode**: Built-in theme switcher for a comfortable viewing experience in any lighting.
- **Responsive Design**: Fully optimized for desktops, tablets, and mobile phones.

---

## 🚀 Getting Started

No installation or server setup is required! You can run this application directly in your browser.

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge, etc.)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/financial-analysis-and-management.git
    ```
2.  **Navigate to the project folder:**
    ```bash
    cd financial-analysis-and-management
    ```
3.  **Launch the App:**
    - Simply open the `index.html` file in your web browser.

---

## 📖 Usage Guide

1.  **Start Tracking**:
    - Go to the **Operating** page.
    - Enter your income and expenses for each day.
    - Add any "Extra Expenses" below the daily cards.

2.  **Analyze**:
    - Click **Generate Weekly Report** to see a summary of your week.
    - Visit the **Reports** page for detailed charts and graphs.

3.  **Manage Data**:
    - Use **End Week** to archive the current week and start fresh.
    - Use **Export Data** from the Reports page to create a backup.

---

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3 (Custom Properties for theming).
- **Scripting**: Vanilla JavaScript (ES6+).
- **Charting**: Custom lightweight Canvas API implementation (`js/charts.js`).
- **Storage**: Browser `localStorage` API.
- **Icons**: Emoji & SVG.

---

## 📁 File Structure

```
financial-analysis-and-management/
├── index.html          # Landing page
├── pages/
│   ├── operating.html  # Main tracker interface
│   ├── report.html     # Analytics dashboard
│   ├── about.html      # User guide & documentation
│   └── contacts.html   # Support information
├── css/
│   ├── styles.css      # Core styles & variables
│   └── report.css      # Report-specific styling
├── js/
│   ├── app.js          # Core application logic
│   ├── storage.js      # Data persistence layer
│   ├── charts.js       # Custom charting library
│   ├── report.js       # Report generation logic
│   └── theme.js        # Dark/Light mode manager
├── docs/               # Project documentation
└── images/             # Assets
```

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📞 Contact

For questions, support, or feedback, please reach out:

- **Email:** am3lue@gmail.com

---

<p align="center">
  &copy; 2026 Financial Analysis & Management. All rights reserved.
</p>