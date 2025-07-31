# GoSplit - Travel Expense Splitting Feature

## Overview

GoSplit is a comprehensive expense splitting feature integrated into the PackPalGo travel app. It allows users to create travel groups, add expenses, and automatically calculate who owes whom, making it easy to split bills among friends and family during trips.

## Features

### 🏗️ Group Management
- **Create Groups**: Create travel groups with custom names, emojis, and optional budgets
- **Join Groups**: Join existing groups using 6-character invite codes
- **Member Management**: Add members by email or name, with real-time updates
- **Invite System**: Share invite codes or group links to add new members

### 💰 Expense Tracking
- **Smart Splitting**: Three splitting options:
  - **Equal Split**: Divide expenses equally among all members
  - **Share-based Split**: Assign different shares to members
  - **Custom Split**: Set exact amounts for each member
- **Categories**: Organized expense categories (Food, Transport, Accommodation, etc.)
- **Rich Details**: Add descriptions, dates, notes, and categorize expenses
- **Real-time Sync**: All expense data syncs instantly across devices

### ⚖️ Balance Calculation
- **Smart Balancing**: Automatic calculation of who owes whom
- **Settlement Optimization**: Minimizes the number of transactions needed
- **Visual Balance Display**: Color-coded balance cards showing individual positions
- **Payment Integration**: Placeholder buttons for UPI, Paytm, and Google Pay

### 📊 Analytics & Filtering
- **Expense Filtering**: Filter by category, payer, and date range
- **Statistics**: View total spending, average expenses, and budget usage
- **Budget Tracking**: Set group budgets and track spending progress
- **Export Ready**: Data structured for easy export and reporting

### 🔒 Security & Authentication
- **Google Authentication**: Secure sign-in with Google accounts
- **User Permissions**: Group-based access control
- **Data Privacy**: Each group's data is isolated and secure

## Technical Architecture

### Tech Stack
- **Frontend**: React 18 with Tailwind CSS
- **Backend**: Firebase Firestore (NoSQL database)
- **Authentication**: Firebase Auth with Google provider
- **State Management**: React hooks with real-time listeners
- **UI Framework**: Tailwind CSS with custom components
- **Icons**: Emoji-based icons for mobile-friendly design

### Firebase Structure

```
groups/
├── {groupId}/
│   ├── name: string
│   ├── emoji: string
│   ├── members: string[]
│   ├── memberEmails: string[]
│   ├── createdBy: string
│   ├── createdAt: timestamp
│   ├── inviteCode: string (6-char)
│   ├── budget: number (optional)
│   ├── totalExpenses: number
│   ├── totalAmount: number
│   └── expenses/
│       └── {expenseId}/
│           ├── description: string
│           ├── amount: number
│           ├── payer: string
│           ├── category: string
│           ├── date: timestamp
│           ├── notes: string
│           ├── splitType: "equal" | "shares" | "custom"
│           ├── splits: {member: amount}
│           └── createdAt: timestamp
```

### Component Structure

```
src/components/GoSplit/
├── GroupList.jsx           # Main groups list page
├── GroupDetails.jsx        # Individual group management
├── CreateGroupModal.jsx    # Group creation interface
├── JoinGroupModal.jsx      # Group joining interface
├── AddExpenseModal.jsx     # Expense creation with smart splitting
├── ExpenseList.jsx         # Expense display with filtering
├── BalanceSummary.jsx      # Balance calculation and settlements
├── GroupInfo.jsx           # Group settings and member management
└── AuthWrapper.jsx         # Authentication wrapper
```

## Key Algorithms

### Balance Calculation
The balance calculation uses a two-phase approach:

1. **Accumulation Phase**: For each expense, add the full amount to the payer's balance and subtract each member's split amount
2. **Settlement Phase**: Use a greedy algorithm to minimize transactions by matching highest creditors with highest debtors

### Smart Splitting
- **Equal Split**: `amount / memberCount`
- **Share Split**: `(amount * memberShares) / totalShares`
- **Custom Split**: Direct amount assignment with validation

### Invite Code Generation
- Generates 6-character alphanumeric codes using `Math.random().toString(36)`
- Ensures uniqueness within the Firebase database
- Easy to share and remember

## Usage Guide

### Creating a Group
1. Click "Create Group" on the main GoSplit page
2. Enter group name and select an emoji
3. Optionally set a budget
4. Add initial members or skip to invite later
5. Share the generated invite code with friends

### Adding Expenses
1. Open a group and click "Add Expense"
2. Fill in description, amount, and select who paid
3. Choose expense category and date
4. Select splitting method:
   - **Equal**: Automatically splits evenly
   - **Shares**: Assign relative shares to members
   - **Custom**: Set exact amounts for each member
5. Add optional notes and save

### Settling Balances
1. View the "Balances" tab to see who owes whom
2. Follow suggested settlements for optimal transactions
3. Use payment buttons (placeholders) for UPI/Paytm/GPay
4. Mark settlements as complete manually

### Managing Groups
1. Use "Group Info" tab to view statistics
2. Edit budget, invite new members, or view group details
3. Copy invite codes or share group links
4. Track budget usage and spending patterns

## Mobile Responsiveness

GoSplit is fully optimized for mobile devices:
- **Touch-friendly**: Large buttons and touch targets
- **Responsive Design**: Adapts to all screen sizes
- **Offline-ready**: Works with cached data when offline
- **Fast Loading**: Optimized Firebase queries and lazy loading

## Security Features

- **Authentication Required**: Must sign in to access any features
- **Group Isolation**: Users can only see groups they're members of
- **Input Validation**: All forms validate data before submission
- **Error Handling**: Graceful error messages and fallbacks

## Future Enhancements

### Planned Features
- **Receipt Upload**: Camera integration for receipt scanning
- **Expense Categories**: Custom category creation
- **Export Options**: PDF/CSV export functionality
- **Push Notifications**: Real-time expense notifications
- **Multi-currency**: Support for different currencies
- **Expense Templates**: Quick-add for common expenses

### Integration Opportunities
- **Payment Gateways**: Real UPI/payment integration
- **Location Services**: Auto-detect expense locations
- **Calendar Integration**: Link expenses to trip itineraries
- **Analytics Dashboard**: Advanced spending insights

## Development Notes

### Setup Requirements
1. Install Firebase SDK: `npm install firebase`
2. Install React Firebase Hooks: `npm install react-firebase-hooks`
3. Configure Firebase project with Authentication and Firestore
4. Update `firebase.js` with your project credentials

### Environment Variables
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Testing
- Test with multiple users to verify real-time sync
- Verify balance calculations with complex splitting scenarios
- Test invite code generation and group joining
- Ensure mobile responsiveness across devices

## Contributing

When contributing to GoSplit:
1. Follow the existing component structure
2. Use Tailwind CSS for styling consistency
3. Implement proper error handling
4. Add JSDoc comments for complex functions
5. Test real-time functionality thoroughly

## License

This GoSplit feature is part of the PackPalGo project and follows the same licensing terms.