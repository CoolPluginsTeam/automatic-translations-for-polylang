class BlockFilterSorter {
  constructor() {
    this.tabsSortBy = document.getElementById('atfp-sortby-tab');
    this.filterSelect = document.getElementById('atfp-blocks-filter');
    this.tableBody = document.querySelector('.atfp-supported-blocks-table tbody');
    this.atfpDataTableObj=null;

    if (this.tableBody) {
      this.atfpDataTable();
      
      // Tab sort by Handler
      this.tabsSortBy.addEventListener('input',this.datatableSortByHandler);
      this.filterSelect.addEventListener('input',this.datatableFilterHandler);
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

      this.atfpDataTableObj.on('draw.dt', function() {
        const rows=jQuery(this).find('tbody tr');

        rows.each(function(index,row){
          row.children[0].textContent=index+1;
        });
      });

      const tableWrp = document.getElementById('atfp-supported-blocks-table_wrapper');
      const selectWrapper = document.querySelector('.atfp-supported-blocks-filters');
      selectWrapper.remove();
      tableWrp.prepend(selectWrapper);

      this.datatableSortByHandler();
    }
  }
  
  datatableFilterHandler=()=>{
    if((this.atfpDataTableObj)){
      let selectedFilter=this.filterSelect.value.charAt(0).toUpperCase() + this.filterSelect.value.slice(1);
      selectedFilter=selectedFilter === 'All' ? '' : selectedFilter;
      this.atfpDataTableObj.column(3).search(selectedFilter, false, false, false).draw();
    }
  }

  datatableSortByHandler=()=>{
    if((this.atfpDataTableObj)){
      let sortBy=this.tabsSortBy.value;
      let sortDir='asc';
      if(sortBy === 'name'){
        sortBy=1;
        sortDir='asc';
      }else if(sortBy === 'supported'){
        sortBy=3;
        sortDir='asc';
      }else if(sortBy === 'unsupported'){
        sortBy=3;
        sortDir='desc';
      }
      this.atfpDataTableObj.order([sortBy, sortDir]).draw();
    }
  }
}

// Call the class after window load
window.addEventListener('load', () => {
  new BlockFilterSorter();
});