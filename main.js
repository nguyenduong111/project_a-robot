
// done
// 11 địa điểm, 14 đường đi
/*
    đầu vào là 1 mảng (roads) các phần tử là 1 string dạng ("from-to")
*/
const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
  ];

//done
// tạo hàm xây dựng bản đồ : input là mảng roads
// mục tiêu: tại mỗi điểm, chỉ ra nhưng điểm có thẻ đi tiếp
function buildGraph(edges) {
    let graph = Object.create(null);   // tạo đối tượng để lưu bản đồ
    function addEdge(from, to) {       // hàm cập nhật địa điểm hiện tại (from), tới địa điểm tiếp thep có thể đến (to)
        if (graph[from] == null) {     // nếu chưa có điểm tới nào
            graph[from] = [to];        // thì thêm vào
        } else {                       // nếu đã có điểm tới
            graph[from].push(to);      // thêm tiếp điểm tới khác
        }
    }

    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }
    /*
    giải thích vòng for: mỗi phần tử của edges đang mảng string dạng "from-to"
        dùng map để duyệt qua các phần tử, trong map gọi callback dùng split("-") để tách
        phần tử từ "from-to" sang ["from", "to"], gán vào var from, var to để 
        chạy hàm addEge
    + sử dụng đồng thời addEdge(from, to); và addEdge(to, from); do từ A -> B thì B->A
    
    */
    return graph;    
    /*
    trả về bản đồ khi này ở dạng obj với
        key là tên địa điểm, value là mảng string gồm các điểm đến của nó
            Alice's House: (3) ["Bob's House", "Cabin", "Post Office"]
            Bob's House: (2) ["Alice's House", "Town Hall"]
            Cabin: ["Alice's House"]
            .....
    */
}

const roadGraph = buildGraph(roads);

console.log(roadGraph);   // các tuyến đường đi theo địa điểm đã chuyển đổi


// done
/*
 xây dựng class VillageState: chứa vị trí hiện tại + mảng các đơn hàng
    * hàng: gồm địa điểm hiện tại + địa chỉ nhận hàng.
 + mục tiêu: kiểm tra vị trí tiếp theo(B) so với vị trí hiện tại (A)
            + nếu vị trí B không nằm trong các vị trí tới của A
                *trả về lại VillageState cũ
            + nếu vị trí B nằm trong các vị trí tới của A thực hiện kiểm tra các đơn hàng
                + nếu vị trí đơn hàng với vị trí hiện tại khác nhau, giữ nguyên
                + nếu vị trí đơn hàng với vị trí hiện tại giống nhau, chỉnh lại thông
                    tin đơn đó thành {place: B, address: như cũ}
                    Cuối cùng lọc ra các đơn hàng có place và address giống nhau (đã đc giao) ra, trả về mảng các đơn hàng chưa đc giao
                *trả về VillageState có vị trí hiện tại là B, mảng đơn hàng đã lọc
    
*/
class VillageState {
    constructor(place, parcels) {
      this.place = place;        // vị trí robot place
      this.parcels = parcels;    // bưu kiện
    }
  
    move(destination) {          // hàm kiểm tra vị trí tiếp theo robot đến (des)
        if(!roadGraph[this.place].includes(destination)) {     // nếu des ko nằm trong tập các điểm tới của place

            return this;               // trả về VillageState ban đầu                     
        } else {                                               // nếu des nằm trong tập các điểm tới của place
            let parcels = this.parcels.map(p => {              // kiểm tra và xếp lại các đơn
                if (p.place != this.place) return p;           // nếu vị trí đơn khác place, ko thay đổi thông tin đơn
                return {place: destination, address: p.address};   // nếu vị trí đơn giống place, thực hiện sửa thông tin đơn (vị trí hiện tại đơn: des, nơi nhận: giữ nguyên)
            }).filter(p => p.place != p.address);                  // lọc các đơn có thông tin (vị trí hiện tại đơn và nơi nhận giống nhau, đơn đã đc giao) bỏ đi, trả về các đơn chưa đc giao

            return new VillageState(destination, parcels);         // trả về VillageState mới có vị trí hiện tại: des, và các đơn lọc ở bước trên
        }
    }
}

let first = new VillageState(
    "Post Office", [{place: "Post Office", address: "Alice's House"}]
    );
let next = first.move("Alice's House");
    
console.log(next.place);
    // → Alice's House
console.log(next.parcels);
    // → []
console.log(first.place);
    // → Post Office
    
/*//done
let object = Object.freeze({value: 5});  // là 1 phương thức giúp "đóng băng" dữ liệu của obj
                                         // *cần nhớ kể cả khi khởi tạo obj dạng const, ta vẫn có thể thay đổi giá trị bên trong obj 
object.value = 10;

console.log(object.value);
// → 5
*/

// done
function runRobot(state, robot, memory) {
    for (let turn = 0;; turn++) {
        let temp = state.parcels.length;
        
        if (state.parcels.length == 0) {
            console.log(`Done in ---------------- ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        if(temp != state.parcels.length) {
            console.log('-------------   ', temp);
        }
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);

    }
}


//done
function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    
    return array[choice];
}

  
//done
function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])};
}


// done
// tạo phương thức random trong class VillageState
/*
+ mục tiêu: tạo ra 5 đơn hàng (parcelCount = 5)
+ return: 1 VillageState mới có ("Post Office", parcels);  
*/
VillageState.random = function(parcelCount = 5) {
    let parcels = [];                             // tạo mảng trống để lưu đơn hàng
    for (let i = 0; i < parcelCount; i++) {       // tạo vòng lặp để xây dựng đơn
        let address = randomPick(Object.keys(roadGraph));   // lựa chọn ngẫu nhiên 1 điểm nhận hàng
                                                            // obj.keys là phương thức chuyển đổi tất cả các key của obj về dạng mảng
        let place;            // đối tượng lưu điểm giao hàng 
        do {
            place = randomPick(Object.keys(roadGraph));     // khi tìm đc điểm giao khác điểm nhận thì lưu lại 
        } while (place == address);

        parcels.push({place, address});                     // push thông tin đơn hàng vào mảng chứa
    }

    return new VillageState("Post Office", parcels);        // trả về 1 VillageState mới có vị trí hiện tại là Post Office và gồm 5 đơn hàng
};

/*
var test = new VillageState("Post Office", [
    {place: "Shop", address: "Marketplace"},
    {place: "Marketplace", address: "Town Hall"},
    {place: "Shop", address: "Daria's House"},
    {place: "Grete's House", address: "Town Hall"},
    {place: "Shop", address: "Marketplace"}
]);

let tim = (parcels, pla) => parcels.some( p => p.place === pla);

console.log(tim(test.parcels, "Post Office"));
*/


/*
    * ý tưởng 1:
chạy robot theo cách sinh ngẫu nhiên điểm đến tiếp theo
chạy đến khi nào gửi hết đơn hàng
*/

// test: 1 ------- số bước lớn hoặc nhỏ, ko ổn định
// runRobot(VillageState.random(), randomRobot);     

// → Moved to Marketplace
// → Moved to Town Hall
// → …
// → Done in 63 turns


/// tạo 1 tuyến đg đi qua tất cả các địa điểm bắt đầu từ Post Office 
const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
  ];

/*
  * ý tưởng cải tiến 2:
      cho robot chạy lại tuyến đg mailRoute
      khi đó số bước đi nhiều nhất để hoàn thành đơn hàng có thể xảy ra là 26 bước.
*/

// hàm trả về địa điểm tiếp theo đi + mảng những điểm chưa đi
// done
function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute;
    }

    return {direction: memory[0], memory: memory.slice(1)}; // arr.slice trả về 1 bản sao mảng từ phần tử start đến end (ko bao gồm end)
}

//   runRobotAnimation(VillageState.random(), routeRobot, []);

// test: 2 ---------- số bước luôn <= 26 bước
// runRobot(VillageState.random(), routeRobot, []);         

// runRobot(test, routeRobot, []);



function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];
    for (let i = 0; i < work.length; i++) {
        let {at, route} = work[i];
        for (let place of graph[at]) {
            if (place == to) return route.concat(place);
            if (!work.some(w => w.at == place)) {
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}
/*
+ arr.some (bool) tìm xem trong mảng có phần tử thỏa mãn ko
+ arr.concat ([]) tạo ra một mảng mới từ 2 mảng phần phần
*/

function goalOrientedRobot({place, parcels}, route) {
    if (route.length == 0) {
        let parcel = parcels[0];
        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
        } else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    }
    
    return {direction: route[0], memory: route.slice(1)};
}


// test 3: thường ít hơn 18 lượt
// runRobot(VillageState.random(), goalOrientedRobot, []);
// runRobot(test, goalOrientedRobot, []);


//   runRobotAnimation(VillageState.random(),
//   goalOrientedRobot, []);

/*
đề 1: có 100 nhiệm vụ (mỗi nhiệm vụ gồm 5 đơn hàng), tạo ra 2 robot sử dụng 2 hàm tìm đg
    là routeRobot và goalOrientedRobot để thực hiện đồng thời từng nhiệm vụ
    lưu lại kết quả từng nhiệm vụ, trả lại số bước đi trung bình của từng robot
*/

// my code

var mission = 100;

function runRobot_1(state, robot, memory) {
    for (let turn = 0;; turn++) {
        if (state.parcels.length == 0) {
            return turn / mission;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
    }
}


function compareRobots(robot1, memory1, robot2, memory2) {
    let resultRobot1 = 0;
    let resultRobot2 = 0;

    for(let i = 0; i < mission; i ++) {
        let state = VillageState.random();
        resultRobot1 += runRobot_1(state, robot1, memory1);
        resultRobot2 += runRobot_1(state, robot2, memory2);
    }

    console.log(resultRobot1.toFixed(0));
    console.log(resultRobot2.toFixed(0));
}

// run đề 1
// compareRobots(routeRobot, [], goalOrientedRobot, []);


// runRobotAnimation(VillageState.random(), yourRobot, memory);

/*
đề 2: cải thiện hàm goalOrientedRobot, hiện tại hàm đang luôn tìm đg đến nơi nhận đơn
hàng đầu tiên để chuyển nó, trong khi có thể có 1 đơn khác đang ở gần đó hơn
* ý tưởng cải thiện, tìm trong kho hàng đơn gần nhất để làm
*/
// mt code

let placeInParcels = (parcels, pla) => parcels.some( p => p.place === pla);
let parcel = (parcels, pla) => parcels.find(p => p.place === pla);
// console.log(tim(test.parcels, "Post Office"));


// function goalOrientedRobot_1({place, parcels}, route) {
//     if (route.length == 0) {
//         if(placeInParcels(parcels, place)) {
//             route = findRoute(roadGraph, place, parcel(parcels, place).address);
//         } else {
//             let routes = {min: 13, rou: []};
//             for(let i = 0; i < parcels.length; i ++) {
//                 let temp = findRoute(roadGraph, place, parcels[i].place);
//                 if(temp.length < routes.min) {
//                     routes.min = temp.length;
//                     routes.rou = new Array(...temp);
//                 }
//             }
//             route = routes.rou;
//         }
//     }
    
//     return {direction: route[0], memory: route.slice(1)};
// }

// compareRobots(goalOrientedRobot, [], goalOrientedRobot_1, []);

// function goalOrientedRobot_1({place, parcels}, route) {
//     if (route.length == 0) {
//         let orderRoutes = [];       // gửi
//         let receiveRoutes = [];     // nhận
    
//         for (const parcel of parcels) {
//           if (parcel.place != place) {
//             orderRoutes.push(findRoute(roadGraph, place, parcel.place));
//           } else {
//             receiveRoutes.push(findRoute(roadGraph, place, parcel.address));
//           }
//         }
    
//         orderRoutes.sort((a, b) => {
//           return a.length - b.length;
//         });
    
//         receiveRoutes.sort((a, b) => {
//           return a.length - b.length;
//         });
    
//         // route = orderRoutes.length == 0 ? receiveRoutes[0] : orderRoutes[0];
//         // route = receiveRoutes.length < orderRoutes.length ? receiveRoutes[0] : orderRoutes[0];
//         if(orderRoutes.length == 0) {
//             route = receiveRoutes[0];
//         }else {
//             route = receiveRoutes.length < orderRoutes.length ? receiveRoutes[0] : orderRoutes[0];
//         }
//     }

//     console.log(route);
//     return { direction: route[0], memory: route.slice(1) };
// }

// var t = VillageState.random();
// console.log(t);
// console.log("++++++++++++++++++++++");
// runRobot(t, goalOrientedRobot_1, []);

function goalOrientedRobot_2({place, parcels}, route) {
    if (route.length == 0) {
        let orderRoutes = [];       // gửi
        let receiveRoutes = [];     // nhận
    
        for (const parcel of parcels) {
          if (parcel.place != place) {
            orderRoutes.push(findRoute(roadGraph, place, parcel.place));
          } else {
            receiveRoutes.push(findRoute(roadGraph, place, parcel.address));
          }
        }
    
        orderRoutes.sort((a, b) => {
          return a.length - b.length;
        });
    
        receiveRoutes.sort((a, b) => {
          return a.length - b.length;
        });
    
        route = orderRoutes.length == 0 ? receiveRoutes[0] : orderRoutes[0];
        // // route = receiveRoutes.length < orderRoutes.length ? receiveRoutes[0] : orderRoutes[0];
        // if(orderRoutes.length == 0) {
        //     route = receiveRoutes[0];
        // }else {
        //     route = receiveRoutes.length < orderRoutes.length ? receiveRoutes[0] : orderRoutes[0];
        // }
    }

    // console.log(route);
    return { direction: route[0], memory: route.slice(1) };
}

// run đề 2
// runRobot(VillageState.random(), goalOrientedRobot_2, []);
compareRobots(goalOrientedRobot, [], goalOrientedRobot_2, []);


// đề 3
class PGroup {
    constructor(group) {
        this.group = group;
    }

    add(pra) {
        let arr = new Array(...this.group);
        arr.push(pra);
        let newPG = new PGroup(arr);
        return newPG;   
    }

    delete(pra) {
        let arr = this.group.filter(p => p != pra);
        let newPG = new PGroup(arr);
        return newPG;
    }

    has(pra) {
        return this.group.some(p => p === pra);
    }
  }
  PGroup.empty = new PGroup([]);
  let a = PGroup.empty.add("a");
  let ab = a.add("b");
  let b = ab.delete("a");
  
  console.log(a);
  console.log(ab);
  console.log(b);

  console.log(b.has("b"));
  // → true
  console.log(a.has("b"));
  // → false
  console.log(b.has("a"));
  // → false

