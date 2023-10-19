import { Page, Card, DataTable, TextContainer } from '@shopify/polaris';
import { useState } from 'react';

function SortableDataTableExample() {
  const [sortedRows, setSortedRows] = useState(null);

  const initiallySortedRows = [
    ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
    ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
    [
      'Navy Merino Wool Blazer with khaki chinos and yellow belt',
      '$445.00',
      124518,
      32,
      '$14,240.00',
    ],
  ];

  const handleSort = (index, direction) => {
    setSortedRows(sortCurrency([...initiallySortedRows], index, direction));
  };

  const sortCurrency = (rows, index, direction) => {
    return [...rows].sort((rowA, rowB) => {
      const amountA = parseFloat((rowA[index] || 0).toString().substring(1));
      const amountB = parseFloat((rowB[index] || 0).toString().substring(1));

      return direction === 'descending' ? amountB - amountA : amountA - amountB;
    });
  };

  const rows = sortedRows || initiallySortedRows;

  return (
    <Page title="Sales by product">
      <Card>
        <TextContainer>
          <DataTable
            columnContentTypes={[
              'text',
              'numeric',
              'numeric',
              'numeric',
              'numeric',
            ]}
            headings={[
              'Product',
              'Price',
              'SKU Number',
              'Net quantity',
              'Net sales',
            ]}
            rows={rows}
            totals={['', '', '', 255, '$155,830.00']}
            sortable={[false, true, false, false, true]}
            defaultSortDirection="descending"
            initialSortColumnIndex={4}
            onSort={handleSort}
          />
        </TextContainer>
      </Card>
    </Page>
  );
}

export default SortableDataTableExample;
