class BlockFilterSorter {
  constructor() {
    this.tabsSortBy = document.getElementById('atfp-sortby-tab');
    this.filterSelect = document.getElementById('atfp-blocks-filter');
    // this.searchInput = document.getElementById('atfp-blocks-search');
    this.tableBody = document.querySelector('.atfp-supported-blocks-table tbody');
    this.atfpDataTableObj=null;

    // this.attachEventListeners();
    // this.filterAndSortData(); // Call initially to ensure data is displayed correctly on page load

    if (this.tableBody) {
      this.atfpDataTable();
      
      // Tab sort by Handler
      this.tabsSortBy.addEventListener('input',this.datatableSortByHandler);
      this.filterSelect.addEventListener('input',this.datatableFilterHandler);
    }
  }

  // filterAndSortData() {
  //   const selectedFilter = this.filterSelect.value;
  //   let selectedTab = this.tabsSortBy.value;
  //   let searchValue = this.searchInput.value.toLowerCase();
  //   searchValue = searchValue.trim();

  //   let allRows = this.tableBody.querySelectorAll('tr');
  //   let filteredRows = allRows;
  //   let sortedRows = [];
  //   let index = 1;

  //   // Apply filter based on selected tab
  //   if (selectedFilter !== 'all') {
  //     this.tabsSortBy.disabled = true; // Disable the selectedTab option
  //     selectedTab = 'name';
  //     filteredRows = [...filteredRows].filter(row => {
  //       return row.dataset.blockStatus === selectedFilter;
  //     });
  //   } else {
  //     this.tabsSortBy.disabled = false; // Enable the selectedTab option if 'all' is selected
  //   }

  //   if (searchValue) {
  //     filteredRows = [...filteredRows].filter(row => {
  //       const blockName = row.children[1].textContent.toLowerCase();
  //       const blockTitle = row.children[2].textContent.toLowerCase();
  //       return blockName.includes(searchValue) || blockTitle.includes(searchValue);
  //     });
  //   }

  //   // Apply sorting based on selected filter
  //   if (selectedTab === 'name') {
  //     sortedRows = this.sortByName(allRows);
  //   } else if (selectedTab === 'supported') {
  //     sortedRows = this.sortBySupported(allRows);

  //   } else if (selectedTab === 'unsupported') {
  //     sortedRows = this.sortByUnsupported(allRows);
  //   } else {
  //     // Handle unexpected filter values (optional)
  //     console.warn('Invalid filter value:', selectedTab);
  //     return;
  //   }

  //   // Hide all rows initially
  //   this.tableBody.querySelectorAll('tr').forEach(row => row.classList.add('hidden'));

  //   this.tableBody.innerHTML = ''; // Clear existing rows
  //   filteredRows.forEach(row => {
  //     row.children[1].textContent = row.children[1].textContent.replace(/<span class="atfp-search-highlight">(.*?)<\/span>/g, '$1');
  //     row.children[2].textContent = row.children[2].textContent.replace(/<span class="atfp-search-highlight">(.*?)<\/span>/g, '$1');

  //     row.classList.remove('hidden');
  //   });

  //   this.tableBody.innerHTML = ''; // Clear existing rows
  //   sortedRows.forEach((row, _) => {
  //     this.tableBody.appendChild(row); // Append the row to the table body

  //     if (!row.classList.contains('hidden')) {
  //       row.children[0].textContent = index;
  //       index++;

  //       if (searchValue != '') {
  //         const searchValueRegex = new RegExp(`(${searchValue})`, 'gi');
  //         row.children[1].innerHTML = row.children[1].textContent.replace(searchValueRegex, '<span class="atfp-search-highlight">$1</span>');
  //         row.children[2].innerHTML = row.children[2].textContent.replace(searchValueRegex, '<span class="atfp-search-highlight">$1</span>');
  //       }
  //     }
  //   });
  // }

  // sortByName(rows) {
  //   return [...rows].sort((a, b) => {
  //     const nameA = a.children[1].textContent.toLowerCase();
  //     const nameB = b.children[1].textContent.toLowerCase();
  //     return nameA.localeCompare(nameB);
  //   });
  // }

  // sortBySupported(rows) {
  //   const supportedBlocks = [];
  //   const otherBlocks = [];

  //   rows.forEach(row => {
  //     if (row.dataset.blockStatus === 'supported') {
  //       supportedBlocks.push(row);
  //     } else {
  //       otherBlocks.push(row);
  //     }
  //   });

  //   return [...supportedBlocks, ...otherBlocks];
  // }

  // sortByUnsupported(rows) {
  //   return [...rows].sort((a, b) => {
  //     const statusA = a.dataset.blockStatus;
  //     const statusB = b.dataset.blockStatus;
  //     return statusA === statusB ? 0 : statusA === 'unsupported' ? -1 : 1;
  //   });
  // }

  // attachEventListeners() {
  //   this.tabsSortBy.addEventListener('change', () => this.filterAndSortData());
  //   this.filterSelect.addEventListener('change', () => this.filterAndSortData());
  //   this.searchInput.addEventListener('input', () => this.filterAndSortData());
  // }

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