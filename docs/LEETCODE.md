# Leetcode
The request
```
{"query":"\n    query studyPlanDetail($slug: String!) {\n  studyPlanV2Detail(planSlug: $slug) {\n    slug\n    name\n    highlight\n    staticCoverPicture\n    colorPalette\n    threeDimensionUrl\n    description\n    premiumOnly\n    needShowTags\n    awardDescription\n    defaultLanguage\n    award {\n      name\n      config {\n        icon\n        iconGif\n        iconGifBackground\n      }\n    }\n    relatedStudyPlans {\n      cover\n      highlight\n      name\n      slug\n      premiumOnly\n    }\n    planSubGroups {\n      slug\n      name\n      premiumOnly\n      questionNum\n      questions {\n        translatedTitle\n        titleSlug\n        title\n        questionFrontendId\n        paidOnly\n        id\n        difficulty\n        hasOfficialSolution\n        topicTags {\n          slug\n          name\n        }\n        solutionInfo {\n          solutionSlug\n          solutionTopicId\n        }\n      }\n    }\n  }\n}\n    ","variables":{"slug":"top-interview-150"},"operationName":"studyPlanDetail"}
```

Needs a referer header.
```
{
    'Referer' : 'https://github.com/Meeshbhombah/dsa'
}
```

Endpoint
```
https://leetcode.com/graphql
```

Viewable here:
```
https://leetcode.com/studyplan/top-interview-150/
```

Inspect element, then click Network. Filter by `graphql`, switch to the 
"Payload" tab. The `operationName` for the correct query should be 
`studyPlanDetail`.

