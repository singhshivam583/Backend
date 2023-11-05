db.products.aggregate([{
    $group:{
        _id:`$company`,
        total:{$sum: 1},
    }
}])

db.products.aggregate([{
    $match:{
        company:'64c23350e32f4a51b19b924d'
    }
}])