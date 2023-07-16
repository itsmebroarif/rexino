new Vue({
    el: '#app',
    data: {
      invoiceNumber: '',
      amount: '',
      discount: 0,
      invoices: [],
      totalAmount: 0,
      discountAmount: 0,
      editMode: false,
      editedInvoice: null
    },
    created() {
      if (localStorage.getItem('invoices')) {
        this.invoices = JSON.parse(localStorage.getItem('invoices'));
        this.calculateTotal();
      }
    },
    methods: {
      addInvoice() {
        this.invoices.push({
          id: Date.now(),
          invoiceNumber: this.invoiceNumber,
          amount: this.amount,
          discount: this.discount
        });
        this.calculateTotal();
        this.saveInvoicesToLocalStorage();
        this.invoiceNumber = '';
        this.amount = '';
        this.discount = 0;
      },
      deleteInvoice(id) {
        const index = this.invoices.findIndex(invoice => invoice.id === id);
        if (index !== -1) {
          this.invoices.splice(index, 1);
          this.calculateTotal();
          this.saveInvoicesToLocalStorage();
        }
      },
      editInvoice(invoice) {
        this.editMode = true;
        this.editedInvoice = { ...invoice };
      },
      updateInvoice() {
        const index = this.invoices.findIndex(invoice => invoice.id === this.editedInvoice.id);
        if (index !== -1) {
          this.invoices[index] = { ...this.editedInvoice };
          this.calculateTotal();
          this.saveInvoicesToLocalStorage();
          this.cancelEdit();
        }
      },
      cancelEdit() {
        this.editMode = false;
        this.editedInvoice = null;
      },
      calculateTotal() {
        this.totalAmount = this.invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
        this.discountAmount = this.invoices.reduce((sum, invoice) => sum + (Number(invoice.amount) * Number(invoice.discount) / 100), 0);
      },
      saveInvoicesToLocalStorage() {
        localStorage.setItem('invoices', JSON.stringify(this.invoices));
      },
      formatCurrency(value) {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(value);
      },
      exportToCSV() {
        const csvContent = "data:text/csv;charset=utf-8," + this.convertToCSV(this.invoices);
        const encodedURI = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedURI);
        link.setAttribute("download", "invoices.csv");
        document.body.appendChild(link);
        link.click();
      },
      convertToCSV(data) {
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map(obj => Object.values(obj).join(","));
        return `${headers}\n${rows.join("\n")}`;
      }
    }
  });