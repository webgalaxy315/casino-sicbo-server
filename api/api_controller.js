const axios = require("axios");
const rand = require("random-seed").create();
require("dotenv").config();

const getArray = (num, max) => {
    let array = [];
    for (let i = 0; i < num; i++) {
        let random = rand.intBetween(1, max);
        array.push(random);
    }
    return array;
}
const getSum = (diceArray) => {
    let sum = 0;
    for (var i = 0; i < diceArray.length; i++) {
        sum += diceArray[i];
    }
    return sum;
}
const getbetArray = (para) => {
    let array = [];
    for (var i = 0; i < para.length; i++) {
        let element = {};
        if (para[i] != "0") {
            element["index"] = i;
            element["Amount"] = parseFloat(para[i]);
            array.push(element);
        } else {
            continue;
        }
    }
    return array;
}

const getEarnAmount = async (betArray, diceArray, diceSum) => {
    let earnAmount = 0;
    let array = [];
    for (let _betArray of betArray) {
        if (_betArray.index > 5 && _betArray.index < 21) {
            let amount = await combination_(_betArray, diceArray);
            if (amount > 0) {
                array.push(_betArray.index);
            }
            earnAmount += amount;
        } else if (_betArray.index > 20 && _betArray.index < 35) {
            let amount = await Total_(_betArray, diceSum);
            if (amount > 0) {
                array.push(_betArray.index);
            }
            earnAmount += amount;
        } else if (_betArray.index == 35 || _betArray.index == 49) {
            let amount = await SB_(_betArray, diceSum);
            if (amount > 0) {
                array.push(_betArray.index);
            }
            earnAmount += amount;
        } else if (_betArray.index > 35 && _betArray.index < 39 || _betArray.index > 45 && _betArray.index < 49) {
            let amount = await Double_(_betArray, diceArray);
            if (amount > 0) {
                array.push(_betArray.index);
            }
            earnAmount += amount;
        } else if (_betArray.index == 42) {
            let amount = await A_Triple_(_betArray, diceArray);
            if (amount > 0) {
                array.push(_betArray.index);
            }
            earnAmount += amount;
        } else if (_betArray.index > 38 && _betArray.index < 42 || _betArray.index > 42 && _betArray.index < 46) {
            let amount = await S_Triple_(_betArray, diceArray);
            if (amount > 0) {
                array.push(_betArray.index);
            }
            earnAmount += amount;
        } else if (_betArray.index >= 0 && _betArray.index < 6) {
            let amount = await single_(_betArray, diceArray);

            if (amount > 0) {
                array.push(_betArray.index);
            }
            earnAmount += amount;
        }
    }
    array.push(earnAmount);
    return array;
}
const single_ = (betArray, diceArray) => {
    let earnAmount = 0;
    let num = 0;
    for (let _single of single) {
        if (_single.index == betArray.index) {
            diceArray.forEach(
                (i) => {
                    if (i == _single.counts) {
                        num++;
                    }
                });
            if (num == 1) {
                earnAmount += betArray.Amount * 2;
            } else if (num == 2) {
                earnAmount += betArray.Amount * 3;
            } else if (num == 3) {
                earnAmount += betArray.Amount * 4;
            }
        }
    }
    return earnAmount;
}
const combination_ = (betArray, diceArray) => {
    let earnAmount = 0;
    for (let _combination of combination) {
        if (_combination.index == betArray.index) {
            if (diceArray.indexOf(_combination.counts[0]) != -1 && diceArray.indexOf(_combination.counts[1]) != -1) {
                earnAmount += betArray.Amount * _combination.rate;
            }
        }
    }
    return earnAmount;
}
const Total_ = (betArray, diceSum) => {
    let earnAmount = 0;
    for (let _Total of Total) {
        if (_Total.index == betArray.index) {
            if (_Total.counts == diceSum) {
                earnAmount += betArray.Amount * _Total.rate;
            }
        }
    }
    return earnAmount;
}
const SB_ = (betArray, diceSum) => {
    let earnAmount = 0;
    if (betArray.index == 35) {
        if (diceSum > 3 && diceSum < 11) {
            earnAmount += betArray.Amount * 2;
        }
    } else {
        if (diceSum > 10 && diceSum < 18) {
            earnAmount += betArray.Amount * 2;
        }
    }
    return earnAmount;
}
const Double_ = (betArray, diceArray) => {
    let earnAmount = 0;
    let counts = [];
    let num = 0;
    let value = 0;
    for (let _Double of Double) {
        if (_Double.index == betArray.index) {
            diceArray.forEach(
                (i) => {
                    counts[i] = (counts[i] || 0) + 1;
                    if (counts[i] > 1) {
                        num++;
                        value = i;
                    }
                });
            if (num > 0 && _Double.counts.indexOf(value) != -1) {
                earnAmount += betArray.Amount * _Double.rate;
            } else {
                break;
            }
        }
    }
    return earnAmount;
}
const S_Triple_ = async (betArray, diceArray) => {
    let earnAmount = 0;
    for (let _S_Triple of S_Triple) {
        if (_S_Triple.index == betArray.index) {
            if (await arrayEquals(diceArray, _S_Triple.counts)) {
                earnAmount += betArray.Amount * _S_Triple.rate;
            }
        }
    }
    return earnAmount;
}
const A_Triple_ = async (betArray, diceArray) => {
    let earnAmount = 0;
    for (var i = 1; i < 7; i++) {
        let array = [];
        for (var j = 0; j < 3; j++) {
            array.push(i);
        }
        if (await arrayEquals(diceArray, array)) {
            earnAmount += betArray.Amount * 35;
            break;
        }
    }
    return earnAmount;
}

const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

let single = [
    {
        index: 0,
        counts: 1
    },
    {
        index: 1,
        counts: 2
    },
    {
        index: 2,
        counts: 3
    },
    {
        index: 3,
        counts: 4
    },
    {
        index: 4,
        counts: 5
    },
    {
        index: 5,
        counts: 6
    }
]

let combination = [
    {
        index: 6,
        counts: [1, 2],
        rate: 7
    },
    {
        index: 7,
        counts: [1, 3],
        rate: 7
    },
    {
        index: 8,
        counts: [1, 4],
        rate: 7
    },
    {
        index: 9,
        counts: [1, 5],
        rate: 7
    },
    {
        index: 10,
        counts: [1, 6],
        rate: 7
    },
    {
        index: 11,
        counts: [2, 3],
        rate: 7
    },
    {
        index: 12,
        counts: [2, 4],
        rate: 7
    },
    {
        index: 13,
        counts: [2, 5],
        rate: 7
    },
    {
        index: 14,
        counts: [2, 6],
        rate: 7
    },
    {
        index: 15,
        counts: [3, 4],
        rate: 7
    },
    {
        index: 16,
        counts: [3, 5],
        rate: 7
    },
    {
        index: 17,
        counts: [3, 6],
        rate: 7
    },
    {
        index: 18,
        counts: [4, 5],
        rate: 7
    },
    {
        index: 19,
        counts: [4, 6],
        rate: 7
    },
    {
        index: 20,
        counts: [5, 6],
        rate: 7
    }
]
let Total = [
    {
        index: 21,
        counts: 4,
        rate: 69
    },
    {
        index: 22,
        counts: 5,
        rate: 35
    },
    {
        index: 23,
        counts: 6,
        rate: 21
    },
    {
        index: 24,
        counts: 7,
        rate: 14
    },
    {
        index: 25,
        counts: 8,
        rate: 10
    },
    {
        index: 26,
        counts: 9,
        rate: 8
    },
    {
        index: 27,
        counts: 10,
        rate: 7
    },
    {
        index: 28,
        counts: 11,
        rate: 7
    },
    {
        index: 29,
        counts: 12,
        rate: 8
    },
    {
        index: 30,
        counts: 13,
        rate: 10
    },
    {
        index: 31,
        counts: 14,
        rate: 14
    },
    {
        index: 32,
        counts: 15,
        rate: 21
    },
    {
        index: 33,
        counts: 16,
        rate: 35
    },
    {
        index: 34,
        counts: 17,
        rate: 69
    },
]
let Double = [
    {
        index: 36,
        counts: [1, 1],
        rate: 13
    },
    {
        index: 37,
        counts: [2, 2],
        rate: 13
    },
    {
        index: 38,
        counts: [3, 3],
        rate: 13
    },
    {
        index: 46,
        counts: [4, 4],
        rate: 13
    },
    {
        index: 47,
        counts: [5, 5],
        rate: 13
    },
    {
        index: 48,
        counts: [6, 6],
        rate: 13
    },
]
let S_Triple = [
    {
        index: 39,
        counts: [1, 1, 1],
        rate: 205
    },
    {
        index: 40,
        counts: [2, 2, 2],
        rate: 205
    },
    {
        index: 41,
        counts: [3, 3, 3],
        rate: 205
    },
    {
        index: 43,
        counts: [4, 4, 4],
        rate: 205
    },
    {
        index: 44,
        counts: [5, 5, 5],
        rate: 205
    },
    {
        index: 45,
        counts: [6, 6, 6],
        rate: 205
    },
]
module.exports = {
    BET: async (req, res) => {
        try {
            let users = [];
            let earnAmount = 0;

            const { token, betAmount, dice_mark } = req.body;

            const bet_Amount = parseFloat(betAmount);
            const diceMark = dice_mark.split(",");
            const betArray = await getbetArray(diceMark);
            users[token] = {
                token: token,
                betAmount: bet_Amount,
                betArray: betArray
            }

            try {
                await axios.post(process.env.PLATFORM_SERVER + "api/games/bet", {
                    token: users[token].token,
                    amount: users[token].betAmount
                });
            } catch (err) {
                throw new Error("BET ERROR!");
            }

            try {
                let diceArray = await getArray(3, 6);
                let diceSum = await getSum(diceArray);
                let indexArray = await getEarnAmount(users[token].betArray, diceArray, diceSum);
                earnAmount = indexArray[indexArray.length - 1];
                indexArray.pop();
                res.json({
                    diceArray: diceArray,
                    earnAmount: earnAmount,
                    indexArray: indexArray,
                    Message: "SUCCESS!"
                })

            } catch (err) {
                throw new Error("DATA ERROR!");
            }
            try {
                await axios.post(process.env.PLATFORM_SERVER + "api/games/winlose", {
                    token: users[token].token,
                    amount: earnAmount,
                    winState: earnAmount > 0 ? true : false
                });
            } catch (err) {
                throw new Error("SERVER ERROR!");
            }
        } catch (err) {
            res.json({

                Message: err.message
            });
        }
    },
};
