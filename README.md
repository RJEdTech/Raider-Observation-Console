# Raider Observation Console

**For department chairs and administrators filing an observation.** Collapses the iObservation **Conduct an Observation** screen to the elements you are actually using, and brings the rubric out from behind *View Scale* — Regis Jesuit High School.

**[Set up Raider Observation Console →](https://rjedtech.github.io/Raider-Observation-Console/)**

## The problem

The form opens with **41 elements**, nine design questions, nine student-interview blocks and several hundred checkboxes, all expanded. A chair watching one class for twenty minutes uses about three of them.

Nothing in the platform gets you to element 15. The built-in *Filter elements by* dropdown offers only *Select all elements* and *Not Started* — it filters by status, not by element. The Type dropdown opens unset, which is why drafts show up as N/A. The rubric that decides Applying from Developing sits behind a panel you open and close once per element. And the form's own Save and Review sit in a header that scrolls off the top of the screen.

So chairs scroll, hunt, and scroll back.

## What it does

One click on the screen you already have open:

- **Only the elements you chose** — the other 38 hidden, the interview blocks hidden unless you want them. Searchable list of all 41, the chair eight marked, click a title to jump straight to it. Your selection is remembered, so the next visit opens the way you left it.
- **Presets** — Chair 8 · Walkthrough 9 · All 41 · None
- **Type and the evaluation flag on screen** — Type unset goes red; one click sets **Formal**, one more sets the evaluation flag to **No**
- **Show rubric** — the element's real scale text pinned under the checkboxes, Applying and Developing in full and the other three greyed
- **Comment** — jumps to that element's comment box, cursor in it, box taller than the vendor's
- **Next unscored**, a running scored count, and a red flag if two levels get ticked on one element
- **Save and Review** in the bar, so you don't scroll back up to find them

Press the bookmark again, or **Close**, and the form is back exactly as it was.

## What it does not do

It never ticks a box, never writes a comment, never submits anything. Save and Review press the form's own buttons when *you* press them. It reformats the page in front of you and nothing else.

## Why a bookmark and not a web page

The form lives behind your login on the vendor's site. A separate web page can't reach it, and Canvas strips `javascript:` links out of pages, so the button can't live in a course. A bookmark whose address is code is the only way to run something against a page you're already looking at without installing an extension.

## Privacy

- No accounts, no login, no ads, no cookies, no tracking
- No data leaves the browser — it reads the page already rendered on your screen
- The only thing stored is which elements you like to see, in your own browser
- Nothing is logged, so there is no way for anyone to tell you used it

## How to use

1. Visit the link above.
2. Press `Ctrl` `Shift` `B` to show your bookmarks bar.
3. **Drag** the button into the bookmarks bar — don't click it.
4. In iObservation, start a **Conduct an observation** on the *Standard 3: Models Ignatian Pedagogy* form, or **Continue** a draft. Let it finish loading.
5. Click **Observation Console** on your bookmarks bar.

## The one thing it can't decide for you

**Applying and Developing describe the same strategy.** The only difference is whether you saw the teacher check that it landed. **Beginning** — not Developing — is the level for a strategy done wrong or half done. That is why the rubric text now sits under the checkboxes instead of behind a panel.

## Files

| File | What it is |
|---|---|
| `index.html` | The setup page. Holds the bookmarklet, URL-encoded, in the drag link. |
| `console.js` | The same code, readable. Edit here, then re-encode into `index.html`. |

## Notes

- **Built against:** the Angular/PrimeNG conduct screen at `ieobservation.com/app/observations/<id>/conduct`, Standard 3, September 2026.
- **Tested on:** a Standard 3 draft — 41 elements and 9 interview blocks indexed, chair eight shown.
- **Not yet confirmed on screen:** the *Show rubric* round trip through the View Scale drawer.
- The vendor can change the page under this at any time. If the bar appears but nothing collapses, tell Educational Technology.
