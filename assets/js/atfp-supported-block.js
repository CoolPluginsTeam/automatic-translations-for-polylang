class BlockFilterSorter {
  constructor() {
    this.filterSelect = document.getElementById('atfp-blocks-filter');
    this.categorySelect = document.getElementById('atfp-blocks-category');
    this.tableBody = document.querySelector('.atfp-supported-blocks-table tbody');
    this.atfpDataTableObj=null;

    if (this.tableBody) {
      this.atfpDataTable();
      
      // Tab sort by Handler
      this.filterSelect.addEventListener('input',this.datatableFilterHandler);
      this.categorySelect.addEventListener('input',this.datatableCategoryHandler);
    }
  }

  atfpDataTable() {
    if (this.tableBody) {
      this.atfpDataTableObj = new DataTable('#atfp-supported-blocks-table',{
        pageLength: 25,
        infoCallback: function ( settings, start, end, total, max ) {
          return `Showing ${start} to ${end} of ${max} records`;
        }
      });

      this.atfpDataTableObj.on('draw.dt', function(e) {
        const rows=jQuery(this).find('tbody tr');

        if(rows.length.length === 0){
          this.atfpDataTableObj.empty();
        }

        const length = e.dt.page.info().length;
        const page = e.dt.page.info().page;

        rows.each(function(index,row){
          const emptyCell=row.querySelector('td.dt-empty');
          if(!emptyCell){
            row.children[0].textContent = (page * length) + index + 1;
          }
        });
      });

      const tableWrp = document.getElementById('atfp-supported-blocks-table_wrapper');
      const selectWrapper = document.querySelector('.atfp-supported-blocks-filters');
      selectWrapper.remove();
      tableWrp.prepend(selectWrapper);
    }
  }
  
  datatableFilterHandler=()=>{
    if((this.atfpDataTableObj)){
      let selectedFilter=this.filterSelect.value.charAt(0).toUpperCase() + this.filterSelect.value.slice(1);
      selectedFilter=selectedFilter === 'All' ? '' : selectedFilter;
      this.atfpDataTableObj.column(3).search(selectedFilter, false, false, false).draw();
    }
  }

  datatableCategoryHandler=()=>{
    if((this.atfpDataTableObj)){
      let selectedCategory=this.categorySelect.value;
      selectedCategory=selectedCategory === 'all' ? false : selectedCategory;
      this.atfpDataTableObj.column(1).search(selectedCategory ? new RegExp('^' + selectedCategory + '/') : '', false, false, false).draw();
    }
  }
}

// Call the class after window load
window.addEventListener('load', () => {
  new BlockFilterSorter();
});