![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Skiddle API Lab

### Introduction

Your task is to take the `starter-code` provided, and implement a new piece of functionality to the cities show page.

Underneath the "Events in London" heading you should add **radio buttons** for each of the event categories specified in the [Skiddle documentation](https://github.com/Skiddle/web-api/wiki/Events-API).

* FEST = Festivals
* LIVE = Live music
* CLUB = Clubbing/Dance music
* DATE = Dating event
* THEATRE = Theatre/Dance
* COMEDY = Comedy
* EXHIB = Exhibitions and Attractions
* KIDS = Kids/Family Event
* BARPUB = Bar/Pub event
* LGB = Gay/Lesbian event
* SPORT = Sporting event
* ARTS = The Arts

### Requirements

A user can only select one radio button at a time, and therefore can only search for one category of event at a time.

If a user selects one of the radio buttons, you should make a new request to the Skiddle API using the `skiddle` service, and pass in a new `eventcode` parameter.

To begin with, make sure that you can retrieve events by category by hardcoding one into the proxy request, like we did with `latitude` and `longitude`.

You will need to add `ng-model` to these inputs, and add `$scope.$watch` on this value so that a function is called each time the value of the `ng-model` changes.

### Bonus

Style the radio buttons - have a look at some Code Pens for inspiration.
