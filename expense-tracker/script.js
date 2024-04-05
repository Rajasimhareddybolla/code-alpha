document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalBilling = document.getElementById('total-billing');
    
    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        const expenseNote = document.getElementById('expense-note').value;
        const expenseImage = document.getElementById('expense-image').value;

        if (expenseName && expenseAmount && !isNaN(expenseAmount)) {
            addExpense(expenseName, expenseAmount, expenseNote, expenseImage);
            saveToLocalStorage(expenseName, expenseAmount, expenseNote, expenseImage);
            expenseForm.reset();
            updateTotalBilling();
        } else {
            alert("Please enter a valid amount.");
        }
    });

    function addExpense(name, amount, note, image) {
        const expenseItem = document.createElement('li');
        expenseItem.className = 'expense-item';
        const imageSrc = image ? (image) : '';
        expenseItem.innerHTML = `
        <div class="card bg-dark text-white">
        <img  src="${imageSrc}" class="card-img" alt="...">
        <div class="card-img-overlay">
          <h5 class="card-title"> ${name} :${amount}</h5>
          <p class="card-text"> ${note}.</p>
          <button class="delete-btn"> Delete </button>
                                      <button class="edt-btn">Edit</button>  </div>
      </div>
            `;
        
        expenseList.appendChild(expenseItem);
        expenseItem.querySelector('.edt-btn').addEventListener('click', function() {
            editExpense(expenseItem);
        });
        expenseItem.querySelector('.delete-btn').addEventListener('click', function() {
            deleteExpense(expenseItem);
        });
    }

    function editExpense(expenseItem) {
        const newName = prompt('Enter new name:');
        const newAmount = parseFloat(prompt('Enter new amount:'));
        if (newName !== null && newAmount !== null && !isNaN(newAmount)) {
            const expenseDetails = expenseItem.querySelector('span');
            expenseDetails.textContent = `${newName}: ${newAmount}`;
            updateLocalStorage(expenseItem);
            updateTotalBilling();
        } else {
            alert("Please enter a valid amount.");
        }
    }
    function deleteExpense(item) {
        const id = Number(item.getAttribute('data-id'));
        removeFromLocalStorage(id);
        item.remove();
    
        updateTotalBilling();
      }

    function saveToLocalStorage(name, amount, note, image) {
        let expenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];
        expenses.push({name: name, amount: amount, note: note, image: image ? image : ''});
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function updateLocalStorage(expenseItem) {
        let expenses = JSON.parse(localStorage.getItem('expenses'));
        const index = Array.from(expenseList.children).indexOf(expenseItem);
        expenses[index] = {
            name: expenseItem.querySelector('span').textContent.split(':')[0].trim(),
            amount: parseFloat(expenseItem.querySelector('span').textContent.split(':')[1].trim()),
            note: expenseItem.querySelector('p').textContent.split(':')[1].trim(),
            image: expenseItem.querySelector('img') ? expenseItem.querySelector('img').src.split('/').pop() : ''
        };
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function removeFromLocalStorage(expenseItem) {
        let expenses = JSON.parse(localStorage.getItem('expenses'));
        const index = Array.from(expenseList.children).indexOf(expenseItem);
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function loadExpenses() {
        let expenses = localStorage.getItem('expenses');
        if (expenses) {
            expenses = JSON.parse(expenses);
            expenses.forEach(expense => {
                addExpense(expense.name, expense.amount, expense.note, expense.image ? expense.image : null);
            });
        }
    }

    function updateTotalBilling() {
            const expenses = document.querySelectorAll('.expense-item');
        let total = 0;
        expenses.forEach(expense => {
            const amount = parseFloat(expense.querySelector('h5').innerHTML.split(':')[1].trim());
            if (!isNaN(amount)) {
                total += amount;
            }
        });
        totalBilling.innerHTML = `Total Billing: $${total.toFixed(2)}`;
    }

    loadExpenses();
    updateTotalBilling();
});
