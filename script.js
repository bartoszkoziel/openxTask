window.onload = async () => {

   let users, carts, products

   await fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
         products = data
         subTask2(products)
      })
      .catch(error => console.error(error))

   await fetch('https://fakestoreapi.com/users')
      .then(response => response.json())
      .then(data => { users = data })
      .catch(error => console.error(error))

   await fetch('https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07')
      .then(response => response.json())
      .then(data => { carts = data })
      .catch(error => console.error(error))


   console.log("PRODUCTS: ", products)
   console.log("CARTS: ", carts)
   console.log("USERS: ", users)

   subTask3(carts, products, users)

}

function subTask2(products) {
   const categories = new Map()

   for (let i = 0; i < products.length; i++) {
      if (categories.has(products[i].category)) {
         categories.set(products[i].category, Math.round((categories.get(products[i].category) + products[i].price) * 100) / 100)
      } else {
         categories.set(products[i].category, products[i].price)
      }
   }

   let list2 = document.createElement("ul")
   for (const key of categories.keys()) {
      // console.log(key)
      let tr = document.createElement("tr")
      let tdKey = document.createElement("td")
      let tdValue = document.createElement("td")

      tdKey.innerHTML = key
      tdValue.innerHTML = " $" + categories.get(key)

      tr.append(tdKey, tdValue)
      list2.append(tr)
   }

   document.body.append(list2)

   console.log("CATEGORIES", categories)
}

function subTask3(carts, products, users) {
   // MAPPING PRODUCTS ID'S TO THEIR VALUE
   const prodToVal = new Map()
   let maxVal = 0
   let maxValId = undefined
   let maxValUser = ""

   for (let i = 0; i < products.length; i++) {
      prodToVal.set(products[i].id, products[i].price)
   }

   // ITERATING THROUGH CARTS
   for (let i = 0; i < carts.length; i++) {
      let tempVal = 0
      for (let j = 0; j < carts[i].products.length; j++) {
         tempVal += prodToVal.get(carts[i].products[j].productId) * carts[i].products[j].quantity
      }
      // console.log("KOSZYK NR: ", i, " RAZEM: ", tempVal)
      if (tempVal > maxVal) {
         maxVal = tempVal
         maxValId = carts[i].userId
      }
   }

   // FINDING THE FULL NAME BY THE USER ID
   for (let i = 0; i < users.length; i++) {
      if (users[i].id == maxValId) {
         maxValUser = users[i].name.firstname.charAt(0).toUpperCase() + users[i].name.firstname.slice(1) + " " + users[i].name.lastname.charAt(0).toUpperCase() + users[i].name.lastname.slice(1)
      }
   }

   let p = document.createElement("p")
   p.innerHTML = "Cart with the highest value has items worth: $" + maxVal + " and is owned by: " + maxValUser
   document.body.append(p)
   // console.log("MAXVAL : ", maxVal)
   // console.log("MAXVAL_ITER : ", maxValId)
   // console.log("MAXVAL_USER : ", maxValUser)

   // 0: Object { productId: 1, quantity: 4 }
   // 1: Object { productId: 2, quantity: 1 }
   // 2: Object { productId: 3, quantity: 6 }

   // 439.8 + 22.3 + 335.94 = 798.04
}