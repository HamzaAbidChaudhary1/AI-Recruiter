import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { faker } from '@faker-js/faker'

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Types
interface Candidate {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  status: 'pending' | 'in-progress' | 'completed' | 'reviewed'
  score: number | null
  assessmentDate: string | null
  resumeUrl: string
  skills: string[]
  experience: number
  location: string
}

interface Assessment {
  id: string
  title: string
  role: string
  duration: number // minutes
  questions: Question[]
  passingScore: number
  createdAt: string
  totalCandidates: number
  completionRate: number
}

interface Question {
  id: string
  type: 'multiple-choice' | 'coding' | 'video' | 'essay'
  question: string
  options?: string[]
  correctAnswer?: string | number
  timeLimit: number // seconds
  points: number
}

// Mock Data Generators
const generateCandidate = (): Candidate => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  role: faker.helpers.arrayElement(['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist']),
  status: faker.helpers.arrayElement(['pending', 'in-progress', 'completed', 'reviewed']),
  score: faker.helpers.maybe(() => faker.number.int({ min: 60, max: 100 }), { probability: 0.7 }),
  assessmentDate: faker.helpers.maybe(() => faker.date.recent().toISOString(), { probability: 0.7 }),
  resumeUrl: faker.internet.url(),
  skills: faker.helpers.arrayElements(['JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'], { min: 3, max: 7 }),
  experience: faker.number.int({ min: 1, max: 15 }),
  location: faker.location.city() + ', ' + faker.location.country()
})

const generateAssessment = (): Assessment => ({
  id: faker.string.uuid(),
  title: faker.company.catchPhrase() + ' Assessment',
  role: faker.helpers.arrayElement(['Frontend Developer', 'Backend Developer', 'Full Stack Developer']),
  duration: faker.helpers.arrayElement([30, 45, 60, 90]),
  questions: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, generateQuestion),
  passingScore: faker.number.int({ min: 60, max: 80 }),
  createdAt: faker.date.recent().toISOString(),
  totalCandidates: faker.number.int({ min: 10, max: 200 }),
  completionRate: faker.number.float({ min: 0.4, max: 0.95, precision: 0.01 })
})

const generateQuestion = (): Question => {
  const type = faker.helpers.arrayElement(['multiple-choice', 'coding', 'video', 'essay'])
  
  return {
    id: faker.string.uuid(),
    type,
    question: faker.lorem.sentence() + '?',
    options: type === 'multiple-choice' 
      ? Array.from({ length: 4 }, () => faker.lorem.sentence())
      : undefined,
    correctAnswer: type === 'multiple-choice'
      ? faker.number.int({ min: 0, max: 3 })
      : undefined,
    timeLimit: faker.helpers.arrayElement([60, 120, 180, 300]),
    points: faker.helpers.arrayElement([5, 10, 15, 20])
  }
}

// Generate initial data
const candidates = Array.from({ length: 50 }, generateCandidate)
const assessments = Array.from({ length: 10 }, generateAssessment)

// REST API Routes

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  
  // Mock authentication
  if (email && password) {
    res.json({
      user: {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        role: 'recruiter',
        avatar: faker.image.avatar()
      },
      token: faker.string.alphanumeric(32)
    })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

app.post('/api/auth/verify-token/:token', (req, res) => {
  const { token } = req.params
  
  // Mock token verification for candidate assessment
  if (token) {
    res.json({
      valid: true,
      assessment: assessments[0],
      candidate: {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email()
      }
    })
  } else {
    res.status(404).json({ error: 'Invalid token' })
  }
})

// Candidates endpoints
app.get('/api/candidates', (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query
  
  let filtered = [...candidates]
  
  if (status) {
    filtered = filtered.filter(c => c.status === status)
  }
  
  if (search) {
    const searchLower = String(search).toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower)
    )
  }
  
  const start = (Number(page) - 1) * Number(limit)
  const end = start + Number(limit)
  
  res.json({
    data: filtered.slice(start, end),
    total: filtered.length,
    page: Number(page),
    totalPages: Math.ceil(filtered.length / Number(limit))
  })
})

app.get('/api/candidates/:id', (req, res) => {
  const candidate = candidates.find(c => c.id === req.params.id)
  
  if (candidate) {
    res.json(candidate)
  } else {
    res.status(404).json({ error: 'Candidate not found' })
  }
})

// Assessments endpoints
app.get('/api/assessments', (req, res) => {
  res.json(assessments)
})

app.get('/api/assessments/:id', (req, res) => {
  const assessment = assessments.find(a => a.id === req.params.id)
  
  if (assessment) {
    res.json(assessment)
  } else {
    res.status(404).json({ error: 'Assessment not found' })
  }
})

app.post('/api/assessments', (req, res) => {
  const newAssessment = {
    ...generateAssessment(),
    ...req.body,
    id: faker.string.uuid(),
    createdAt: new Date().toISOString()
  }
  
  assessments.push(newAssessment)
  res.status(201).json(newAssessment)
})

// Analytics endpoints
app.get('/api/analytics/overview', (req, res) => {
  res.json({
    totalCandidates: candidates.length,
    activeCandidates: candidates.filter(c => c.status === 'in-progress').length,
    completedAssessments: candidates.filter(c => c.status === 'completed').length,
    averageScore: faker.number.float({ min: 70, max: 85, precision: 0.1 }),
    weeklyGrowth: faker.number.float({ min: -10, max: 30, precision: 0.1 }),
    topPerformers: candidates
      .filter(c => c.score !== null)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 5)
  })
})

app.get('/api/analytics/pipeline', (req, res) => {
  res.json({
    stages: [
      { name: 'Applied', count: faker.number.int({ min: 100, max: 300 }) },
      { name: 'Screening', count: faker.number.int({ min: 50, max: 150 }) },
      { name: 'Assessment', count: faker.number.int({ min: 30, max: 80 }) },
      { name: 'Interview', count: faker.number.int({ min: 10, max: 40 }) },
      { name: 'Offer', count: faker.number.int({ min: 5, max: 15 }) }
    ],
    conversion: {
      'Applied->Screening': 0.65,
      'Screening->Assessment': 0.75,
      'Assessment->Interview': 0.50,
      'Interview->Offer': 0.40
    }
  })
})

// Assessment submission
app.post('/api/assessments/:id/submit', (req, res) => {
  const { answers, duration, violations } = req.body
  
  res.json({
    success: true,
    score: faker.number.int({ min: 60, max: 100 }),
    passed: faker.datatype.boolean({ probability: 0.7 }),
    feedback: 'Assessment submitted successfully'
  })
})

// WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  // Join room based on user type
  socket.on('join', (data) => {
    if (data.type === 'recruiter') {
      socket.join('recruiters')
      console.log('Recruiter joined:', socket.id)
    } else if (data.type === 'candidate' && data.assessmentId) {
      socket.join(`assessment-${data.assessmentId}`)
      console.log('Candidate joined assessment:', data.assessmentId)
    }
  })
  
  // Simulate real-time updates for recruiters
  const sendUpdates = setInterval(() => {
    // Candidate status update
    if (Math.random() > 0.7) {
      const randomCandidate = faker.helpers.arrayElement(candidates)
      randomCandidate.status = faker.helpers.arrayElement(['in-progress', 'completed'])
      
      io.to('recruiters').emit('candidate-update', {
        type: 'status-change',
        candidate: randomCandidate
      })
    }
    
    // New candidate
    if (Math.random() > 0.9) {
      const newCandidate = generateCandidate()
      candidates.push(newCandidate)
      
      io.to('recruiters').emit('candidate-update', {
        type: 'new-candidate',
        candidate: newCandidate
      })
    }
    
    // Analytics update
    io.to('recruiters').emit('analytics-update', {
      activeSessions: faker.number.int({ min: 5, max: 30 }),
      completedToday: faker.number.int({ min: 10, max: 50 }),
      averageScore: faker.number.float({ min: 65, max: 90, precision: 0.1 })
    })
  }, 5000)
  
  // Proctoring events from candidates
  socket.on('proctoring-event', (data) => {
    console.log('Proctoring event:', data)
    
    // Forward to recruiters
    io.to('recruiters').emit('proctoring-alert', {
      candidateId: data.candidateId,
      violation: data.violation,
      timestamp: new Date().toISOString()
    })
  })
  
  // Assessment progress
  socket.on('assessment-progress', (data) => {
    io.to('recruiters').emit('assessment-progress-update', {
      candidateId: data.candidateId,
      progress: data.progress,
      currentQuestion: data.currentQuestion
    })
  })
  
  socket.on('disconnect', () => {
    clearInterval(sendUpdates)
    console.log('Client disconnected:', socket.id)
  })
})

// Start servers
const PORT = process.env.PORT || 4000
const WS_PORT = process.env.WS_PORT || 4001

httpServer.listen(WS_PORT, () => {
  console.log(`🚀 WebSocket server running on port ${WS_PORT}`)
})

app.listen(PORT, () => {
  console.log(`🚀 REST API server running on port ${PORT}`)
  console.log(`📝 API Documentation: http://localhost:${PORT}/api`)
  console.log('\nAvailable endpoints:')
  console.log('  POST   /api/auth/login')
  console.log('  POST   /api/auth/verify-token/:token')
  console.log('  GET    /api/candidates')
  console.log('  GET    /api/candidates/:id')
  console.log('  GET    /api/assessments')
  console.log('  GET    /api/assessments/:id')
  console.log('  POST   /api/assessments')
  console.log('  POST   /api/assessments/:id/submit')
  console.log('  GET    /api/analytics/overview')
  console.log('  GET    /api/analytics/pipeline')
})
