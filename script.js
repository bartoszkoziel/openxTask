window.onload = async () => {

   let users, carts, products

   await fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => { products = data })
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

   subTask2(products)
   subTask3(carts, products, users)
   subTask4(users)

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
      let tr = document.createElement("tr")
      let tdKey = document.createElement("td")
      let tdValue = document.createElement("td")

      tdKey.innerHTML = key
      tdValue.innerHTML = " $" + categories.get(key)

      tr.append(tdKey, tdValue)
      list2.append(tr)
   }

   document.body.append(list2)

   console.log("CATEGORIES AND THEIR VALUE", categories)
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
   // console.log("MAXVAL_USER : ", maxValUser)

   console.log("THE CART WITH THE HIGHEST VALUE IS WORTH $", maxVal, " and is owned by ", maxValUser)

   // 0: Object { productId: 1, quantity: 4 }
   // 1: Object { productId: 2, quantity: 1 }
   // 2: Object { productId: 3, quantity: 6 }
   // 439.8 + 22.3 + 335.94 = 798.04
}

function subTask4(users) {
   let maxDist = 0
   let furthestUsers
   for (let i = 0; i < users.length - 1; i++) {
      for (let j = i + 1; j < users.length; j++) {
         let tempUser1 = { lat: users[i].address.geolocation.lat, long: users[i].address.geolocation.long }
         let tempUser2 = { lat: users[j].address.geolocation.lat, long: users[j].address.geolocation.long }


         const R = 6371e3; // metres
         const φ1 = tempUser1.lat * Math.PI / 180 // φ, λ in radians
         const φ2 = tempUser2.lat * Math.PI / 180
         const Δφ = (tempUser2.lat - tempUser1.lat) * Math.PI / 180
         const Δλ = (tempUser2.long - tempUser1.long) * Math.PI / 180

         const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

         const d = Math.round(R * c) / 1000  // in metres
         // console.log(tempUser1.lat, " ", tempUser1.long, " | ", tempUser2.lat, " ", tempUser2.long, " DISTANCE: ", d, "km")

         if (d > maxDist) {
            maxDist = d
            furthestUsers = { u1: users[i], u2: users[j] }
         }
      }
   }

   let p = document.createElement("p")
   let userName1 = furthestUsers.u1.username
   let userName2 = furthestUsers.u2.username
   p.innerHTML = "Users living furthest from each other are: " + userName1 + " and " + userName2 + " They are living " + maxDist + " km apart"

   console.log("USERS LIVING FURTHEST FROM EACH OTHER ARE: " + userName1 + " AND " + userName2 + " THEY ARE LIVING " + maxDist + " KM APART")

   document.body.append(p)
}