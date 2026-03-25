// src/components/market/VendorStatementPDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts for better professional look
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0b.woff2', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN7rgOUuhp.woff2', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  // Header Section
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a2c3e',
    letterSpacing: 1,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#4a627a',
    marginBottom: 20,
  },
  // Border Box for Vendor Info
  vendorBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 15,
    marginBottom: 25,
    backgroundColor: '#f9fafb',
  },
  vendorInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  vendorLabel: {
    width: '20%',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  vendorValue: {
    width: '80%',
    fontSize: 10,
    color: '#111827',
  },
  // Table Styles
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#1a2c3e',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 6,
    alignItems: 'center',
  },
  // Column Widths
  colDate: { width: '12%', paddingLeft: 4, fontSize: 9 },
  colTime: { width: '10%', paddingLeft: 4, fontSize: 9 },
  colType: { width: '10%', paddingLeft: 4, fontSize: 9 },
  colNarration: { width: '28%', paddingLeft: 4, fontSize: 9 },
  colCash: { width: '15%', textAlign: 'right', paddingRight: 4, fontSize: 9 },
  colGold: { width: '15%', textAlign: 'right', paddingRight: 4, fontSize: 9 },
  // Footer
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    paddingTop: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  summaryLabel: {
    width: '25%',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
  },
  summaryValue: {
    width: '15%',
    fontSize: 10,
    textAlign: 'right',
  },
  note: {
    marginTop: 15,
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Text utilities
  bold: { fontWeight: 'bold' },
  credit: { color: '#059669' },
  debit: { color: '#dc2626' },
});

export const VendorStatementPDF = ({ 
  vendorName, 
  statement, 
  dateFrom, 
  dateTo 
}: any) => {
  // Safety check
  if (!statement || !statement.data || statement.data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.companyName}>Barakat Al Khair</Text>
            <Text style={styles.subtitle}>Gold Workshop</Text>
          </View>
          <View style={styles.vendorBox}>
            <View style={styles.vendorInfoRow}>
              <Text style={styles.vendorLabel}>Vendor:</Text>
              <Text style={styles.vendorValue}>{vendorName || "N/A"}</Text>
            </View>
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 10 }}>
              No transactions found for this period.
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  // Calculate totals
  const lastTransaction = statement.data[statement.data.length - 1];
  const closingGold = lastTransaction?.runningGold || 0;
  const closingCash = lastTransaction?.runningCash || 0;
  
  // Calculate total debits and credits
  let totalGoldDebit = 0;
  let totalGoldCredit = 0;
  let totalCashDebit = 0;
  let totalCashCredit = 0;
  
  statement.data.forEach((row: any) => {
    totalGoldDebit += row.goldDebit || 0;
    totalGoldCredit += row.goldCredit || 0;
    totalCashDebit += row.cashDebit || 0;
    totalCashCredit += row.cashCredit || 0;
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>Barakat Al Khair</Text>
          <Text style={styles.subtitle}>Gold Workshop & Trading</Text>
        </View>

        {/* Vendor Information Box */}
        <View style={styles.vendorBox}>
          <View style={styles.vendorInfoRow}>
            <Text style={styles.vendorLabel}>Vendor:</Text>
            <Text style={styles.vendorValue}>{vendorName}</Text>
          </View>
          <View style={styles.vendorInfoRow}>
            <Text style={styles.vendorLabel}>Statement Period:</Text>
            <Text style={styles.vendorValue}>{dateFrom || "---"} to {dateTo || "---"}</Text>
          </View>
          <View style={styles.vendorInfoRow}>
            <Text style={styles.vendorLabel}>Generated On:</Text>
            <Text style={styles.vendorValue}>{new Date().toLocaleDateString('en-GB')}</Text>
          </View>
        </View>

        {/* Transaction Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colDate}>Date</Text>
            <Text style={styles.colTime}>Time</Text>
            <Text style={styles.colType}>Type</Text>
            <Text style={styles.colNarration}>Narration</Text>
            <Text style={styles.colCash}>Cash (KWD)</Text>
            <Text style={styles.colGold}>Gold (g)</Text>
          </View>

          {/* Table Rows */}
          {statement.data.map((row: any, i: number) => {
            const date = new Date(row.date);
            const dateStr = date.toLocaleDateString('en-GB');
            const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            
            // Determine transaction type
            let type = '';
            if (row.type === 'send_market') type = 'Send';
            else if (row.type === 'receive_market') type = 'Receive';
            else if (row.type === 'order') type = 'Order';
            else if (row.type === 'cash_payment') type = 'Payment';
            else type = 'Transaction';
            
            // Format cash display (showing change and balance)
            let cashDisplay = '';
            if (row.cashDebit > 0) {
              cashDisplay = `(Dr) ${row.cashDebit.toFixed(3)}\nBal: ${row.runningCash.toFixed(3)}`;
            } else if (row.cashCredit > 0) {
              cashDisplay = `(Cr) ${row.cashCredit.toFixed(3)}\nBal: ${row.runningCash.toFixed(3)}`;
            } else {
              cashDisplay = `-\nBal: ${row.runningCash.toFixed(3)}`;
            }
            
            // Format gold display (showing change and balance)
            let goldDisplay = '';
            if (row.goldDebit > 0) {
              goldDisplay = `(Dr) ${row.goldDebit.toFixed(3)}\nBal: ${row.runningGold.toFixed(3)}`;
            } else if (row.goldCredit > 0) {
              goldDisplay = `(Cr) ${row.goldCredit.toFixed(3)}\nBal: ${row.runningGold.toFixed(3)}`;
            } else {
              goldDisplay = `-\nBal: ${row.runningGold.toFixed(3)}`;
            }
            
            return (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colDate}>{dateStr}</Text>
                <Text style={styles.colTime}>{timeStr}</Text>
                <Text style={styles.colType}>{type}</Text>
                <Text style={styles.colNarration}>{row.narration}</Text>
                <Text style={[styles.colCash, styles.bold]}>{cashDisplay}</Text>
                <Text style={[styles.colGold, styles.bold]}>{goldDisplay}</Text>
              </View>
            );
          })}
        </View>

        {/* Footer Summary */}
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Gold Received (Cr):</Text>
            <Text style={styles.summaryValue}>{totalGoldCredit.toFixed(3)} g</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Gold Given (Dr):</Text>
            <Text style={styles.summaryValue}>{totalGoldDebit.toFixed(3)} g</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cash Received (Dr):</Text>
            <Text style={styles.summaryValue}>{totalCashDebit.toFixed(3)} KWD</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Making Charges (Cr):</Text>
            <Text style={styles.summaryValue}>{totalCashCredit.toFixed(3)} KWD</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 10, borderTopWidth: 1, borderTopColor: '#d1d5db', paddingTop: 10 }]}>
            <Text style={[styles.summaryLabel, { fontSize: 11 }]}>Closing Gold Balance:</Text>
            <Text style={[styles.summaryValue, { fontSize: 11, fontWeight: 'bold' }]}>
              {closingGold.toFixed(3)} g
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { fontSize: 11 }]}>Closing Cash Balance:</Text>
            <Text style={[styles.summaryValue, { fontSize: 11, fontWeight: 'bold' }]}>
              {closingCash.toFixed(3)} KWD
            </Text>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.note}>
       
          <Text style={{ marginTop: 5 }}>This is a computer-generated statement. Valid without signature.</Text>
        </View>
      </Page>
    </Document>
  );
};