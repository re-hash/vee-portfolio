# MediaPipe canonical face geometry

The base facial vertices and topology in `public/models/canonical-face.obj` and derived `src/data/canonical-face.json` come from Google's MediaPipe project:

https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model.obj

Copyright The MediaPipe Authors. Licensed under the Apache License, Version 2.0; see `public/models/mediapipe-LICENSE`.

Changes: coordinate normalization, slight jaw narrowing, added cranium, ears and neck; weighted surface sampling for the particle portrait. This is a neutral anatomical base adapted for this temporary Vee portrait, not a scan of a named person or a final character likeness.
