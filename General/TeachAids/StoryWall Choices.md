# Choices For Clipping

Possible AI Model https://github.com/idealo/image-quality-assessment

-   MobileNet based so very small and compact. Possible to run through browser

## Server vs Client Side

-   Server - Pros - Better if large capacity - Does all the videos over an extended period of time - Video editors don't have to wait - Cons - Cost - Worse for small capacity because if used set to run every day at midnight, people would have to wait for a day - Could slow down other processes if there are other important threads working
-   Client Side - Pros - No server cost - easy extension to get 10 clips - Cons - May slow down if needed to do for many videos - may lag on clients computer depending on type and processer

## Ways to generate clips

-   AI Aesthetic - Pro - will get the most aesthetically pleasing images - Con - May be more cpu/gpu intensive - _Could be fixed by using a MobileNet Model which is quite small and has fast inferencing_ - Would need to develop a way to diversify images collected - _Possible solution might be to split video into 10 parts and find the most aesthetic for each_
-   Random Image Selection - Pros - Faster - Cons - Random image sampling could be from bad/non aesthetic parts of the video - Would need a larger sample size for human to choose from to combat the randomness

## Solutions

From looking at most of the
