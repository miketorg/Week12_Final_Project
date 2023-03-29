class Draft {
  constructor(team) {
    this.team = team;
    this.players = [];
  }

  addPlayer(name, position, id) {
    this.players.push(new Player(name, position, id));
  }
}

class Player {
  static count = 0;constructor(name, position, id) {
    this.name = name;
    this.position = position;
    this.id = Player.count++;
  }
}

class DraftService {
  
  static url = "https://640ff1cb864814e5b6431b31.mockapi.io/api/crud/user";

  static getAllDrafts() {
    console.log($.get(this.url))
    return $.get(this.url); }

  static getDraft(id) {
    return $.get(this.url + `/${id}`);
  }

  static createDraft(draft) {
    return $.post(this.url, draft);  } 
  static updateDraft(draft) {
    console.log(draft)
    return $.ajax({
      url: this.url + `/${draft.id}`,
      dataType: "json",
      data: JSON.stringify(draft),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteDraft(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE", 
    });
  }
}

class DOMManager {
  static drafts; 
  static getAllDrafts() {
    DraftService.getAllDrafts().then((drafts) => this.render(drafts)); 
  }

  static deleteDraft(id) {
    DraftService.deleteDraft(id)
      .then(() => {
        return DraftService.getAllDrafts();
      })
      .then((drafts) => this.render(drafts));
  }

  static createDraft(){
    let team = document.getElementById("new-draft-name").value;
    DraftService.createDraft(new Draft(team))
      .then(() => {
        return DraftService.getAllDrafts();
      })
      .then((drafts) => this.render(drafts));
  }

  static addPlayer(id) {
    for (let draft in this.drafts) {
      if (draft.id == id) {
        draft.players.push(
          new Player(
            $(`#${draft.id}-player-name`).val(),
            $(`#${draft.id}-player-position`).val(),
          )
        );
        DraftService.updateDraft(draft)
          .then(() => {
            return DraftService.getAllDrafts();
          })
          .then((drafts) => this.render(drafts));
      }
    }
  }

  static deletePlayer(draftId, playerId) {
    
    for (let draft in this.drafts) {
      if (draft.id == draftId) {
        for (let player of draft.players) {
          console.log(draft.players); 
          if (player.id == playerId) {
            draft.players.splice(draft.players.indexOf(player), 1);
            DraftService.updateDraft(draft)
              .then(() => {
                return DraftService.getAllDrafts();
              })
              .then((drafts) => this.render(drafts));
          }
        }
      }
    }
  }

  static render(drafts) {
    this.drafts = drafts;
    $("#app").empty();
    for (let draft of drafts) {
      $("#app").prepend(
        `<div id = "${draft.id}" class = "card">
          <div class = "card-header">
            <div class ="row">
                <div class = "col-sm-4">
                    <img src="https://www.profootballnetwork.com/wp-content/uploads/2021/02/nfl-logo-shield-history-design-meaning.jpg"  width="120" height="95">
                </div>
                <div class = "col-sm-4">
                  <h2><b>${draft.team} Draft Pick: ${draft.id}</b></h2>
                  <button class = "btn btn-danger" onclick = "DOMManager.deleteDraft('${draft.id}')">Delete</button>
                </div>
            </div>
            </div>
          <div class = "card-body">
            <div class = "card">
              <div class = "row">  
              
                <div class = "col-sm">
                    <input type = "text" id = "${draft.id}-player-name" class = "form-control" placeholder = "Player Name">
                </div>
                <div class = "col-sm">
                    <input type = "text"  id = "${draft.id}-player-position" class = "form-control" placeholder = "Player Position">
                </div>
                
              </div>
              <button id = "${draft.id}-new-player" onclick = "DOMManager.addPlayer('${draft.id}')" class = "btn btn-success btn-xs">Pick Number '${draft.id}'</button>
            </div>
          </div>
        </div><br>`
      );

      for (let player in draft.players) {
        $(`#${draft.id}`)
          .find(".card-body")
          .append(
            `<p>
            <span id = "player-name-${player.id}"><b>Player Name: </b>${player.name}</span>
            <span id = "player-position-${player.id}"><b>Player Position: </b>${player.position}</span>
            <button class = "btn btn-danger" onclick = "DOMManager.deletePlayer('${draft.id}', 5'${player.id}')">Remove Player</button></p>
            `
          );
      }
    }
  }
} 

// $("#create-new-draft").click(() => {
//   DOMManager.createDraft($("#new-draft-name").val());
//   document.getElementById("new-draft-name").value = "";
// });

DOMManager.getAllDrafts();