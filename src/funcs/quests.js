// PARSE QUESTLOG
function filter({ current, data }) {

   // QUEST CONTAINER
   const container = new Map();

   // LOOP THROUGH DATA TO CURRENT BLOCK
   for (let x = 0; x < current; x++) {

      // SHORTHAND
      const waypoints = data.route[x].waypoints;

      // LOOP THROUGH EACH WAYPOINT
      waypoints.forEach(waypoint => {

         // LOOP THROUGH ENDS
         if (waypoint.ends !== undefined) {
            waypoint.ends.forEach(quest => {
      
               // QUEST NAME
               const name = quest_name(quest);

               // REMOVE IT
               container.delete(name);
            })
         }

         // LOOP THROUGH STARTS
         if (waypoint.starts !== undefined) {
            waypoint.starts.forEach(quest => {
      
               // QUEST NAME
               const name = quest_name(quest);

               // ADD IT
               container.set(name, quest)
            })
         }
      })
   }

   // CONVERT TO ARRAY & RETURN
   return Array.from(container.values());
}

// FIND QUEST NAME
function quest_name(quest) {
   switch (quest instanceof Array) {
      case true: {
         return quest[0]
      }
      default: {
         return quest;
      }
   }
}

// EXTRACT QUEST NAME & ID
function extract(data, state) {

   // NAME PLACEHOLDER & ID
   let name = data;
   const id = fetch_id(data, state.data.quests);

   // IF DATA IS AN ARRAY
   if (typeof data === 'object') {
      name = data[0]
   }

   // TRANSLATE IF NECESSARY
   if (state.settings.language !== 'en') {
      name = state.lang[state.settings.language][id];
   }
   
   return {
      name: name,
      id: id
   }
}

// FETCH QUEST ID FOR SIDEPANEL LINKS
function fetch_id(quest, quests) {
   switch(typeof quest) {

      // STRING
      case 'string': {
         return quests[quest.toString().toLowerCase()];
      }

      // ARRAYS
      default: {
         if(quest.length >= 2) {
            switch(quest[1][0].toLowerCase()) {

               // CHAIN QUEST
               case 'p': {
   
                  // FISH OUT THE CHAIN PART
                  const id = parseInt(quest[1].split('-')[0].replace(/\D/g, '')) - 1;
   
                  // IF THE QUEST NAME EXISTS, RETURN THE ID
                  if (quests[quest[0]] !== undefined) {
                     return quests[quest[0].toString().toLowerCase()][id];
                  
                  // OTHERWISE, RETURN UNDEFINED
                  } else { return undefined; }
               }
   
               // SOMETHING ELSE
               default: {
                  return quests[quest[0].toString().toLowerCase()];
               }
            }
         } else {
            return quests[quest[0].toString().toLowerCase()];
         }
      }
   }
}

export {
   filter,
   extract
}