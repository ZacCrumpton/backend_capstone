﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LocalBuzz_BackEndCapstone.Model
{
    public class Post
    {
        public int PostId { get; set; }
        public int AId { get; set; }
        public string content { get; set; }
        public DateTime DateCreated { get; set; }
    }
}