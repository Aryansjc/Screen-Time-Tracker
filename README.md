# Screen Time Tracker Chrome Extension

A beautiful and feature-rich Chrome extension that helps you monitor and manage your online time usage with detailed statistics, insights, and customizable limits.


## Features

- **Real-time Tracking**: Automatically tracks time spent on different websites
- **Beautiful Dashboard**: Clean and intuitive interface with dark mode support
- **Detailed Statistics**: 
  - Daily activity breakdown
  - Historical data visualization
  - Top sites analysis
  - Progress tracking towards daily goals
- **Smart Insights**:
  - Peak usage hours
  - Productivity trends
  - Category-based analysis
  - Weekly/monthly comparisons
- **Customizable Settings**:
  - Daily screen time goals
  - Site-specific time limits
  - Customizable notifications
  - Dark/light theme toggle
- **Data Management**:
  - Export functionality
  - Data reset options
  - Privacy-focused (all data stored locally)

## Installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

## Usage

### Basic Tracking
- The extension automatically starts tracking when installed
- Click the extension icon to view your current stats
- Switch between different views using the bottom navigation tabs

### Setting Goals
1. Go to the Settings tab
2. Use the slider to set your daily screen time goal
3. Add site-specific limits if desired

### Viewing Stats
- **Today**: See your current day's activity
- **History**: View historical data and trends
- **Insights**: Check detailed analytics and patterns
- **Settings**: Customize your experience

### Features Guide
- **Progress Bar**: Shows progress towards daily goal
- **Site Breakdown**: Lists sites by time spent
- **Charts**: Visual representation of your data
- **Dark Mode**: Toggle theme via the moon icon
- **Export Data**: Download your usage data

## Development

### Project Structure
```
screen-time-tracker/
├── manifest.json        # Extension configuration
├── background.js        # Background service worker
├── popup.html          # Main interface
├── popup.js            # Interface functionality
├── popup.css           # Styling
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # Documentation
```

### Technical Details
- Built with vanilla JavaScript
- Uses Chrome Extension Manifest V3
- Leverages Chrome Storage API for data persistence
- Implements Chrome Alarms API for periodic updates
- Uses Chart.js for data visualization

### Building from Source
1. Clone the repository
2. Make desired modifications
3. Test using Chrome's developer mode
4. Package for distribution if needed

## Privacy

- All data is stored locally on your device
- No data is sent to external servers
- No personal information is collected
- Site usage data is only used for displaying statistics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons provided by Font Awesome
- Charts powered by Chart.js
- Inspired by various screen time tracking tools

