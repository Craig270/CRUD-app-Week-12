// $.get("https://retoolapi.dev/A3H52c/oneword", (id,Name,Word,Avatar) => addCustomers(id,Name,Word,Avatar));

// function addCustomers(response) {
//     let newRow = "";
//     $.each(response, function (i, item) {
//         newRow += "<tr><td>" + item.Name + "</td><td>" + item.Avatar + "</td><td>" + item.Word + "</td></tr>"
//     });
//     console.log(newRow);
//     $("#customer-table").append(newRow);
// }


//1b use a form to add new entities
class User {
    constructor(name) {
      this.Name = name;
      this.words = [];
    }
  
    addWord(word) {
      this.words.push(new Word(word));
    }

}
  
//1c build a way for users to add to entities
class Word {
    constructor(word) {
        this.word = word;
    }
}

//send data entered to an API
class OneWord {
    static url = "https://retoolapi.dev/A3H52c/oneword";

    static getAllUsers() {
        return $.get(this.url);
    }


    static getUser(id) {
        return $.get(this.url + `/${id}`);
    }

    static createUser(user) {
        return $.post(this.url, user);
    }

    static updateUser(name) {
        return $.ajax({
        url: this.url + `/${user.id}`,
        dataType: "json",
        data: JSON.stringify(name),
        contentType: "application/json",
        type: "PUT"
        });
    }

    static deleteUser(id) {
        return $.ajax({
        url: this.url + `/${id}`,
        type: "DELETE"
        });
    }
}
  
//render methods
class DOMManager {
    static users;

    //get all current users
    static getAllUsers() {
        OneWord.getAllUsers().then(users => this.render(users));
    }

    //create a new user, promise comes back and rerender the DOM
    static createUser(name) {
        OneWord.createUser(new User(name))
        .then(() => { //handle promise
        return OneWord.getAllUsers();
        })
        .then((user) => this.render(user));//rerender the DOM after change
    }

    //delete a user and rerender the DOM
    static deleteUser(id) {
        OneWord.deleteUser(id)
        .then(() => { //handle promise
            return OneWord.getAllUsers();
        })
        .then((users) => this.render(users));//rerender the DOM after change
    }

    static addWord(id) {
        for (let user of this.users) {
            if (user._id == id) { //._id is assigned by the API
                user.words.push(new Word($(`#${user._id}-word-word`).val()));
                OneWord.updateUser(user)
                .then(() => { //handle promise
                    return OneWord.getAllUsers();
                })
                .then((user) => this.render(users));//rerender the DOM after change
            }
        }    
    }

    static deleteWord(userId, wordId) {
        for (let user of this.users) {
            if (user._id == userId) {
                for (let word of user.words) {
                    if (word._id == wordId) {
                        user.words.splice(user.word.indexOf(word), 1);
                        OneWord.updateUser(user)
                            .then(() => {
                                return OneWord.getAllUsers();
                            })
                            .then((users) => this.render(users));
                    }
                }    
            }
        }    
    }  

//user interface
static render(users) {
    this.users = users;
    $('#app').empty();
    for (let user of this.users) { 
        $('#app').prepend(
            `<div id="${user._id}" class="card">
                <div class="card-header">
                    <h2>${user.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteUser('${user._id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" id="${user._id}-word-word" class="form-control" placeholder="Word">
                            </div>
                        </div>
                        <button id="${user._id}-new-word" onclick="DOMManager.addWord('${user._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
            </div><br>`
        );
        for (let word of user.words) {
            $(`#${user._id}`).find('.card-body').append(
                `<p>
                    <span id="name-${word._id}"><strong>Name: </strong> ${word.word}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteWord('${user._id}', '${word._id}')">Delete Location</button>
                </p>`
                );
            }
        }
    }
}

//button code to create new user and set field back to clear
$('#create-new-user').on("click", () => {
    DOMManager.createUser($('#new-user-name').val());
    $('#new-user-name').val('');
});

DOMManager.getAllUsers();
