import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://mobileapp-757a0-default-rtdb.europe-west1.firebasedatabase.app/"
}

const inputField = document.getElementById('input-field');
const addBtn = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListDB = ref(database, "shoppingList");


addBtn.addEventListener("click", function() {
    let inputValue = inputField.value;

    if(inputValue !== "") {
// adding data to the Firebase database
        push(shoppingListDB,inputValue);
        clearInputFieldEl();
    }

})

// input field clearing function
function clearInputFieldEl() {
    inputField.value = "";
}

// completely clears the shopping list
function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

// creating a list of elements
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newLi = document.createElement("li");
    newLi.textContent = itemValue;
    shoppingListEl.append(newLi);

    newLi.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    });
}

// Function to check if an element already exists in the list
function isItemInList(itemName) {


    if(typeof itemName === "string") {
        let listItemsOfProducts = shoppingListEl.getElementsByTagName("li");

         for(let i = 0; i < listItemsOfProducts.length; i++) {
            let listItemText = listItemsOfProducts[i].textContent;
            if(listItemText.toLowerCase() === itemName.toLowerCase()) {
                return true;
            }
        }
    }
   return false;

}

// receiving data from database
onValue(shoppingListDB, (snapshot) => {
    if(snapshot.exists() && snapshot.val() !== null) {
        let itemsShopArr = Object.entries(snapshot.val());
        clearInputFieldEl();
        clearShoppingListEl();

        for(let i = 0; i < itemsShopArr.length; i++) {
            let currentItemFromShoppingList = itemsShopArr[i];
            let currentItemID = currentItemFromShoppingList[0];
            let currentItemValue = currentItemFromShoppingList[1];

 //use function isItemInList checks if an element already exists
            if(!isItemInList(currentItemFromShoppingList)) {
                appendItemToShoppingListEl(currentItemFromShoppingList);
            }
        }
    } else {
        shoppingListEl.innerHTML = " No items here ... yet";
    }
});

