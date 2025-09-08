This is a wrapper over the WebToEpub extension (https://github.com/dteviot/WebToEpub) for patching in new features. Particularly, we are adding the capability to download comments for stories on https://novelfire.net.

Testing on:

- https://novelfire.net/book/lord-of-the-mysteries

Added features:

- Append first page of most liked comments into each chapter
  - Replace comments marked as spoiler with the text "[spoiler]"
