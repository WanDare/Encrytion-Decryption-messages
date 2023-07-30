"use strict";
let n, l, e, d;
function calculate() {
var p = document.getElementById("p").value;
var q = document.getElementById("q").value;
if (!(validatePrime(p, "P") && validatePrime(q, "Q"))) {
    return;
}
n = p * q;
document.getElementById("n").value = n;
l = (p - 1) * (q - 1);
document.getElementById("l").value = l;
var ek = findEncryptionKeys(n, l);
document.getElementById("e").value = ek[0];
document.getElementById("encryption-keys").innerHTML = "<span class='color-black'>Possible encryption keys are: </span>" + ek.join(', ');
encryptionKeyChanged();
}
function findEncryptionKeys(n, l) {
    var ek = [];
    // a number between 1 and l that is coprime with n and l
    for (var i = 2; i < l; i++) {
        if (isCoPrime(i, n) && isCoPrime(i, l)) {
            ek.push(i);
            if (ek.length > 5) {
                break;
            }
        }   
    }
    return ek;
}
function encryptionKeyChanged() {
    e = document.getElementById("e").value;   
    var dk = findDecryptionKeys(l, e);
    dk.splice(dk.indexOf(e), 1); 
    d = dk[0];
    document.getElementById("d").value = d;
    document.getElementById("decryption-keys").innerHTML = "<span class='color-black'>Possible decryption keys are: </span>" + dk.join(', ');
    document.getElementById("public-key").innerHTML = "(" + e + ", " + n + ")";
    document.getElementById("private-key").innerHTML = "(" + d + ", " + n + ")";
}
function findDecryptionKeys(l, e) {
    var dk = [];
    for (var d = l + 1; d < l + 100000; d++) {
        // remainder of the product of d and e when divided by l should be 1
        if ((d * e) % l === 1) {
            dk.push(d);
            if (dk.length > 5) {
                return dk;
            }
        }
    }
    return dk;
}
function decryptionKeyChanged() {
    d = document.getElementById("d").value;
    document.getElementById("private-key").innerHTML = "(" + d + ", " + n + ")";
}
function encryptMessage() {
    var message = document.getElementById("message").value;
    var m = Array.from(Array(message.length).keys()).map(i => message.charCodeAt(i));
    var c = m.map(i => modularExponentiation(i, e, n));
    document.getElementById("encrypted-message").innerHTML = c.join(", ");
    document.getElementById("encrypted-message-textbox").value = c.join(", ");
}
function decryptMessage() {
    var c = stringToNumberArray(document.getElementById("encrypted-message-textbox").value);
    var m = c.map(i => modularExponentiation(i, d, n));
    var message = "";
    m.map(x => message += String.fromCharCode(x));
    document.getElementById("decrypted-message").innerHTML = message;
}
function validatePrime(prime, nameOfPrime) {
    if (!isPrime(prime)) {
        document.getElementById("not-prime").innerHTML = "<span class='color-black'>Enter only prime numbers for P & Q:</span> Here, " + nameOfPrime + " is not a Prime Number!<br><span class='color-dark-silver'><em>Reload the page and enter the specified inputs.</em></span>";
        return false;
    }
    return true;
}
function isPrime(num) {
    // why do we check up to the square root of a number to determine if the number is prime...
    let sqrtNum = Math.sqrt(num);
    for (let i = 2; i <= sqrtNum; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return num !== 1;
}
function isCoPrime(a, b) {
	var aFac = findFactors(a);
	var bFac = findFactors(b);
	var result = aFac.every(x => bFac.indexOf(x) < 0);
	return result;
}              
function findFactors(num) {
	var half = Math.floor(num / 2),
		result = [],
		i, j;
	num % 2 === 0 ? (i = 2, j = 1) : (i = 3, j = 2);
	for(i; i <= half; i += j) {
		num % i === 0 ? result.push(i) : false;
	}
	result.push(num);
	return result;
}
function modularExponentiation(base, exponent, modulus) {
	if(modulus === 1) {
		return 0;
	}
	var result = 1;
	base = base % modulus;
	while(exponent > 0) {
		if(exponent % 2 === 1) {
			result = (result * base) % modulus;
		}
		exponent = Math.floor(exponent / 2);
		base = (base * base) % modulus;
	}
	return result;
}
function stringToNumberArray(str) {
    return str.split(",").map(i => parseInt(i));
}