var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calculatePercentages = function(totalIncome) {

    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;

    }
  };


  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };


  var expenses = [];
  var incomes = [];
  var totalExpense = 0;

  var calculateTotal = function(type) {
    var sum = 0;

    data.allItems[type].forEach(function(curr) {
      sum += curr.value;
    });

    data.totals[type] = sum;

  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
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
    },

    deleteItem: function(type, id) {

      var ids = data.allItems[type].map(function(curr) {
        return curr.id;
      });

      var index = ids.indexOf(ids.indexOf(id));

      // Remove the element from the array at index position
      if(index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate budget = income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate percentage income spent
      if(data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {

      data.allItems.exp.forEach(function(curr) {
        curr.calculatePercentages(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(curr) {
        return curr.getPercentage(totalInc);
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExpense: data.totals.exp,
        percentage: data.totals.percentage
      }
    },

    testing: function() {
      console.log(data);
    }
  };
})();



// =============================================================================
var UIController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensePercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(num, type) {
      var numSplit, int, dec, type;
      /*
          + or - before number
          exactly 2 decimal points
          comma separating the thousands

          2310.4567 -> + 2,310.46
          2000 -> + 2,000.00
          */

      num = Math.abs(num);
      num = num.toFixed(2);

      numSplit = num.split('.');

      int = numSplit[0];
      //1000 and more
      if (int.length > 3) {
          int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
      }

      dec = numSplit[1];

      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };

  var nodeListForEach = function(list, callback) {
      for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
      }
  };


    return {
      getInput: function() {
        return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
        var html, newHtml, element;
        // Create HTML string with placeholder text

        if (type === 'inc') {
            element = DOMstrings.incomeContainer;

            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstrings.expenseContainer;

            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // Replace the placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },


    deleteListItem: function(selectorID) {
      var element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },

    deleteListItem: function(selectorID) {
        var element = document.getElementById(selectorID);
        element.parentNode.removeChild(element);
    },


    clearFields: function() {
        var fields, fieldsArr;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach(function(current, index, array) {
            current.value = "";
        });

        // Put cursor back into description field when we clear
        fieldsArr[0].focus();
    },


    displayBudget: function(obj) {
        var type;

        obj.budget > 0 ? type = 'inc' : type = 'exp';

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

        if (obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }

    },

    displayPercentages: function(percentages) {

      var fields = document.querySelectorAll(DOMstrings.expensePercLabel);

      nodeListForEach(fields, function(current, index) {
        if(percentages[index] > 0) {
        current.textContent = percentages[index] + '%';
      } else {
        current.textContent = '---';
      }
      });
    },

    displayMonth: function() {
        var now, months, month, year;

        now = new Date();

        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        month = now.getMonth();

        year = now.getFullYear();
        document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    changedType: function() {

        var fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDescription + ',' +
            DOMstrings.inputValue);

        nodeListForEach(fields, function(cur) {
           cur.classList.toggle('red-focus');
        });

        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

    },


    getDOMstrings: function() {
      return DOMstrings;
    },

    };
})();


// ===========================================================================

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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

  };


  var updateBudget = function() {
    // 1. Calculate budget
    budgetCtrl.calculateBudget()

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on UI
    UICtrl.displayBudget(budget);
    // console.log(budget);

  };

  var updatePercentages = function() {

    // 1. Calculate percentage
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();

    // 3. Update UI
    UICtrl.displayPercentages(percentages);

  }

  var ctrlAddItem = function() {
    var newItem, input;

    // 1. Get input data
    input = UICtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3 . Add item to UI
      UICtrl.addListItem(newItem, input.type);

      // 3.5 Clear fields
      UICtrl.clearFields();

      // 4. Calculate and update budget
      updateBudget()

      // 5. Calculate and update precentage
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, ID, type;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID) {

      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete item from data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete from UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();

    }

  };

  return {
    init: function() {
      console.log('App starts');

      UICtrl.displayMonth();
      UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
      });
      setupEventListeners();
  }
};


})(budgetController, UIController);

controller.init();
