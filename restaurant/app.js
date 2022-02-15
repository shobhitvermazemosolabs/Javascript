const tablesList = [];

function initTables() {
    loadTables();
}

function getTablesListData() {
    return tablesList;
}

function loadTables() {
    let theId;
    for (theId = 1; theId < 7; theId++) {
        tablesList.push(getDefaultTable(theId));
    }

    addTableItems(tablesList);

}

function getDefaultTable(id) {
    const table = {
        'id': id,
        'name': 'table-' + id,
        'cart': [],
        'totalCost': 0,
        'totalItems': 0,
        addItem: function (menuItem) {
            const ind = this.findItemById(menuItem.id);
            if ( ind!= -1) {
                this.cart[ind].quantity += 1;
            } else {
                const item = {
                    'menuItem': menuItem,
                    'quantity': 1
                }
                this.cart.push(item);
            }
            this.totalCost += menuItem.cost;
            this.totalItems += 1;
        },
        addItemById: function (theId) {
            const ind = this.findItemById(theId);
            const menuItem = this.cart[ind].menuItem;

            if ( ind!= -1) {
                this.cart[ind].quantity += 1;
            }
            this.totalCost += menuItem.cost;
            this.totalItems += 1;
        },
        findItemById: function (theId) {
            let index;
            for (index = 0; index < this.cart.length; index++) {
                if (this.cart[index].menuItem.id == theId) {
                    return index;
                }
            }
            return -1;
        },
        removeItemById: function (theId) {
            const ind = this.findItemById(theId);
            if (ind != -1) {
                this.totalCost -= this.cart[ind]['menuItem'].cost;
                this.totalItems -= 1;
                if (this.cart[ind]['quantity'] == 1) {
                    this.cart.splice(ind, 1);
                } else {
                    this.cart[ind]['quantity'] -= 1;
                }
            }
        },
        deleteItemById: function (theId) {
            const ind = this.findItemById(theId);
            if (ind != -1) {
                this.totalCost -= this.cart[ind]['menuItem'].cost*this.cart[ind]['quantity'];
                this.totalItems -= this.cart[ind]['quantity'];
                this.cart.splice(ind, 1);
            }
        },
        resetTable:function(){
            this.cart = [];
            this.totalCost =0;
            this.totalItems =0;
        }
    }
    return table;
}

function addTableItems(tablesArray) {
    const tablesListDiv = document.querySelector('#tables-list');

    tablesArray.forEach(element => {
        tablesListDiv.appendChild(createTableItem(element));
    });
}

function destroyTableItems() {
    const tablesListDiv = document.querySelector('#tables-list');

    tablesListDiv.innerHTML = '';
}

function processSearchTable() {
    const newTablesArray = searchTable();

    destroyTableItems();
    addTableItems(newTablesArray);
}

function renderTables(){
    destroyTableItems();
    addTableItems(tablesList);
}

function searchTable() {
    const searchInput = document.querySelector('#tables-search-input').value.toLowerCase();

    newTablesList = tablesList.filter((table) => {
        if (table.name.indexOf(searchInput) == -1) {
            return false;
        }
        return true;
    });
    return newTablesList;
}

/*
<div table-id="id-value" class="table-container shadow-sm p-3 mb-2 bg-white rounded">
    <div class="table-heading">
        <h7>Table name</h7>
    </div>
    <div class="table-details">
        <p>Rs: (cost)|Total items: (count)</p>
    </div>
</div>
*/

function createTableItem(table) {
    const tableDiv = document.createElement('div');
    tableDiv.setAttribute('table-id', table.id);
    tableDiv.classList.add('table-container', 'shadow-sm', 'mb-2', 'bg-white', 'rounded');
    tableDiv.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
    tableDiv.addEventListener("drop", function (event) {
        event.preventDefault();
        const menuId = event.dataTransfer.getData('menu-id');
        const menuItem = getMenuItemById(menuId);

        table.addItem(menuItem);
        renderTables();
    });
    
    tableDiv.addEventListener("click",()=>{
        document.querySelector(".table-view").style.display = "block";
        generateItems(table);
    });

    const headingDiv = document.createElement('div');
    headingDiv.classList.add('table-heading');

    const h7Element = document.createElement('h7');
    h7Element.innerHTML = table.name;

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('table-details');

    const totalCost = document.createElement('p');
    totalCost.innerHTML = "Rs. " + table.totalCost + " | Total items: " + table.totalItems;

    headingDiv.appendChild(h7Element);
    detailsDiv.appendChild(totalCost);
    tableDiv.appendChild(headingDiv);
    tableDiv.appendChild(detailsDiv);

    return tableDiv;
}

//<button class="btn btn-outline-success">Generate Bill</button>

function generateItems(theTable){
    const tableNameContent = document.querySelector("#table-name");
    tableNameContent.innerHTML = theTable.name;

    const totalAmount = document.querySelector('#total-amount');
    const tableConent = document.querySelector('#cart-list');
    const billContent = document.querySelector('#generate-bill');    

    tableConent.innerHTML = '';
    billContent.innerHTML = '';

    const generateBill = document.createElement('button');
    generateBill.classList.add("btn","btn-outline-success");
    generateBill.innerHTML = 'Generate Bill';
    generateBill.addEventListener('click',function(){
        theTable.resetTable();
        closeTableView();
        renderTables();
    });

    billContent.appendChild(generateBill);

    let serialNo = 1;
    theTable.cart.forEach((item)=>{
        const newRow = document.createElement('tr');
        const serailNoContent =document.createElement('td');
        const itemName = document.createElement('td');
        const itemPrice = document.createElement('td');
        const itemQuantity = document.createElement('td');
        const itemDelete = document.createElement('td');

        const menuItem = item.menuItem;

        const quantityContent = getQuantityContent(theTable,menuItem.id,item.quantity);
        const deleteContent = getDeleteContent(theTable,menuItem.id);

        newRow.setAttribute('index',serialNo-1);

        serailNoContent.innerHTML = serialNo;
        itemName.innerHTML = menuItem.name;
        itemPrice.innerHTML = menuItem.cost*item.quantity;
        itemQuantity.appendChild(quantityContent);
        itemDelete.appendChild(deleteContent);

        newRow.appendChild(serailNoContent);
        newRow.appendChild(itemName);
        newRow.appendChild(itemPrice);
        newRow.appendChild(itemQuantity);
        newRow.appendChild(itemDelete);

        tableConent.appendChild(newRow);

        serialNo ++;
    });

    totalAmount.innerHTML = theTable.totalCost;
}
function getQuantityContent(theTable,theId,theQuantity){
    const span = document.createElement('span');
    span.classList.add('def-number-input','number-input','safari-only')

    const minus = document.createElement('button');
    minus.className="minus";
    minus.addEventListener('click',function(event){        
        theTable.removeItemById(theId);
        generateItems(theTable);
    });
    
    const input = document.createElement('input');
    input.readOnly = true;
    input.className="quantity";
    input.name="quantity";
    input.value =theQuantity;
    input.type = 'number';

    const plus = document.createElement('button');
    plus.className="plus";
    plus.addEventListener('click',function(event){
        theTable.addItemById(theId);
        generateItems(theTable);
    });

    span.appendChild(minus);
    span.appendChild(input);
    span.appendChild(plus);

    return span;
}

function getDeleteContent(theTable,theId){
    const deleteImg = document.createElement('img');
    deleteImg.src = "vendors/icons/delete-big.png";

    deleteImg.addEventListener('click',function(event){
        theTable.deleteItemById(theId);
        generateItems(theTable);
    });
    
    return deleteImg;
}

function initMenu() {
    loadMenu();
}

function loadMenu() {
    addMenuItems(menuList);
}

function addMenuItems(menuArray) {
    const menuDiv = document.querySelector('#menu-list');
    menuArray.forEach(element => {
        menuDiv.appendChild(createMenuItem(element));
    });
}

function destroyMenuItems() {
    const menuDiv = document.querySelector('#menu-list');

    menuDiv.innerHTML = '';
}

function processSearchMenu() {
    const newMenuArray = searchMenu();

    destroyMenuItems();
    addMenuItems(newMenuArray);
}

function searchMenu() {
    const searchInput = document.querySelector('#menu-search-input').value.toLowerCase();

    newMenuList = menuList.filter((menu) => {
        if (menu.name.indexOf(searchInput) !== -1 ||
            menu.type.indexOf(searchInput) !== -1) {
            return true;
        }
        return false;
    });
    return newMenuList;
}

function createMenuItem(menuItem) {
    const containerDiv = document.createElement('div');
    containerDiv.setAttribute('menu-id', menuItem.id);
    containerDiv.classList.add('menu-container', 'shadow-sm', 'mb-2', 'bg-white', 'rounded');
    containerDiv.draggable = true;
    containerDiv.ondragstart = function (event) {
        event.dataTransfer.setData('menu-id', menuItem.id);
    }

    const headingDiv = document.createElement('div');
    headingDiv.classList.add('menu-heading');

    const h6Element = document.createElement('h6');
    h6Element.innerHTML = menuItem.name;

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('menu-details');

    const costElement = document.createElement('p');
    costElement.innerHTML = "Rs. " + menuItem.cost;

    headingDiv.appendChild(h6Element);
    containerDiv.appendChild(headingDiv);
    detailsDiv.appendChild(costElement);
    headingDiv.appendChild(detailsDiv);

    return containerDiv;
}

function getMenuItemById(theId) {
    const newMenuList = menuList.filter((menu) => {
        if (menu.id == theId) {
            return true;
        }
        return false;
    });
    return newMenuList[0];
}

function closeTableView(){
    document.querySelector('.table-view').style.display="none";
    renderTables();
}

