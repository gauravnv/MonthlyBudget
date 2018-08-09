var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var expenses = [];
  var incomes = [];
  var totalExpense = 0;

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, desc, val) {

      var newItem, ID;
      //Create new ID
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // New item based on type
      if(type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if(type === 'inc') {
        newItem = new Income(ID, desc, val);
      }

      // Insert at the end of the array
      data.allItems[type].push(newItem);
      //Return the item
      return newItem;
    }

  }

})();



var UIController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  }

    return {
      getInput: function() {
        return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // HTML placeholder string creation
      if (type === 'inc') {
          element = DOMstrings.incomeContainer;

          html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
          element = DOMstrings.expenseContainer;

          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function() {
        var fields, fieldsArr;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach(function(current, index, array) {
            current.value = "";
        });

        // Put the cursor in the box for descrption after clearing the values
        fieldsArr[0].focus();
    },


    getDOMstrings: function() {
      return DOMstrings;
    },

    };
})();


var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {


    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {

        if(event.key === 13 || event.which === 13) {
          console.log('Enter was pressed');
          ctrlAddItem();
        }

    });
  };




  var ctrlAddItem = function() {

    var newItem, input;


    // 1. Get input data
    input = UICtrl.getInput();
    console.log(input);

    // 2. Item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value)


    //3 . Add item to UI
    UICtrl.addListItem(newItem, input.type);

    // 3.5 Clear fields
    UICtrl.clearFields();

    // 4. Calculate the budget


    // 5. Display the budget on UI
  };

  return {
    init: function() {
      console.log('App starts');
      setupEventListeners();
    }
  };


})(budgetController, UIController);

controller.init();
